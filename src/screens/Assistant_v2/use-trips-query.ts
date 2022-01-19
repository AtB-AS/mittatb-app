import {Location} from '@atb/favorites/types';
import {
  DateString,
  SearchTime,
} from '@atb/screens/Assistant_v2/journey-date-picker';
import {TripPattern} from '@atb/api/types/trips';
import {SearchStateType} from '@atb/screens/Assistant_v2/types';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useCallback, useEffect, useRef, useState} from 'react';
import {CancelToken, isCancel} from '@atb/api';
import {CancelTokenSource} from 'axios';
import {TripsQueryVariables} from '@atb/api/types/generated/TripsQuery';
import {tripsSearch} from '@atb/api/trips_v2';
import Bugsnag from '@bugsnag/react-native';
import {useSearchHistory} from "@atb/search-history";

export default function useTripsQuery(
  fromLocation?: Location,
  toLocation?: Location,
  searchTime: SearchTime = {
    option: 'now',
    date: new Date().toISOString(),
  },
): {
  tripPatterns: TripPattern[];
  timeOfLastSearch: DateString;
  refresh: () => {};
  loadMore: () => {};
  clear: () => void;
  searchState: SearchStateType;
  error?: ErrorType;
} {
  const [timeOfSearch, setTimeOfSearch] = useState<string>(
    new Date().toISOString(),
  );

  const [tripPatterns, setTripPatterns] = useState<TripPattern[]>([]);
  const [pageCursor, setPageCursor] = useState<string>();
  const [errorType, setErrorType] = useState<ErrorType>();
  const [searchState, setSearchState] = useState<SearchStateType>('idle');
  const cancelTokenRef = useRef<CancelTokenSource>();
  const {addJourneySearchEntry} = useSearchHistory();

  const clearTrips = useCallback(() => {
    setTripPatterns([]);
  }, [setTripPatterns]);

  const search = useCallback(
    (cursor?: string, existingTrips?: TripPattern[]) => {
      cancelTokenRef.current?.cancel('New search starting');
      const cancelTokenSource = CancelToken.source();
      let allTripPatterns = existingTrips ?? [];
      if (!cursor) setTripPatterns([]);

      (async function () {
        if (fromLocation && toLocation) {
          try {
            setSearchState('searching');
            let performedSearchesCount = 0;
            let tripsFoundCount = 0;
            while (tripsFoundCount < 10 && performedSearchesCount < 5) {
              const searchInput = cursor ? {cursor} : {searchTime};

              if (searchInput.searchTime?.date) {
                setTimeOfSearch(searchInput.searchTime.date);
              }

              try {
                // Fire and forget add journey search entry
                await addJourneySearchEntry([fromLocation, toLocation]);
              } catch (e) {}

              const arriveBy = searchTime.option === 'arrival';

              const results = await doSearch(
                fromLocation,
                toLocation,
                arriveBy,
                searchInput,
                cancelTokenSource,
              );

              tripsFoundCount += results.trip.tripPatterns.length;
              allTripPatterns = allTripPatterns.concat(
                results.trip.tripPatterns,
              );
              setTripPatterns(allTripPatterns);
              performedSearchesCount++;
              cursor =
                searchTime.option === 'arrival'
                  ? results.trip.previousPageCursor
                  : results.trip.nextPageCursor;
            }
            setPageCursor(cursor);
            setSearchState(
              allTripPatterns.length === 0
                ? 'search-empty-result'
                : 'search-success',
            );
          } catch (e) {
            setTripPatterns([]);
            setPageCursor(undefined);
            if (!isCancel(e)) {
              setSearchState('search-empty-result');
              setErrorType(getAxiosErrorType(e));
              console.warn(e);
            }
          }
        }
      })();

      cancelTokenRef.current = cancelTokenSource;
      setErrorType(undefined);
      return () => {
        cancelTokenSource.cancel('Unmounting use trips hook');
      };
    },
    [fromLocation, toLocation, searchTime],
  );

  useEffect(() => search(), [search]);

  const refresh = useCallback(() => {
    return search();
  }, [clearTrips, search]);

  const loadMore = useCallback(() => {
    return search(pageCursor, tripPatterns);
  }, [search, pageCursor, tripPatterns]);

  return {
    tripPatterns,
    timeOfLastSearch: timeOfSearch,
    refresh,
    loadMore,
    clear: clearTrips,
    searchState: searchState,
    error: errorType,
  };
}

type TimeSearch = {
  searchTime: SearchTime;
  cursor?: never;
};

type CursorSearch = {
  searchTime?: never;
  cursor: string;
};

type SearchInput = TimeSearch | CursorSearch;

async function doSearch(
  fromLocation: Location,
  toLocation: Location,
  arriveBy: boolean,
  {searchTime, cursor}: SearchInput,
  cancelToken: CancelTokenSource,
) {
  const when = searchTime
    ? searchTime.option !== 'now'
      ? searchTime.date
      : new Date().toISOString()
    : undefined;

  const query: TripsQueryVariables = {
    from: fromLocation,
    to: toLocation,
    cursor,
    when,
    arriveBy,
  };

  Bugsnag.leaveBreadcrumb('searching', {
    fromLocation: stringifyLocation(fromLocation),
    toLocation: stringifyLocation(toLocation),
    arriveBy: query.arriveBy,
    when: query.when || '',
    cursor: query.cursor || '',
  });

  return tripsSearch(query, {
    cancelToken: cancelToken.token,
  });
}

const stringifyLocation = (location: Location | undefined) => {
  if (!location) return 'Undefined location';
  return `${location.id}--${location.name}--${location.locality}`;
};
