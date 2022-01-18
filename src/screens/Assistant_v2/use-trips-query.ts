import {Location} from '@atb/favorites/types';
import {
  DateString,
  SearchTime,
} from '@atb/screens/Assistant_v2/journey-date-picker';
import {TripPattern} from '@atb/api/types/trips';
import {SearchStateType} from '@atb/screens/Assistant_v2/types';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useCallback, useEffect, useState} from 'react';
import {CancelToken, isCancel} from '@atb/api';
import {CancelTokenSource} from 'axios';
import {TripsQueryVariables} from '@atb/api/types/generated/TripsQuery';
import {tripsSearch} from '@atb/api/trips_v2';
import Bugsnag from '@bugsnag/react-native';

export default function useTripsQuery(
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  searchTime: SearchTime | undefined,
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
  const [
    cancelTokenSource,
    setCancelTokenSource,
  ] = useState<CancelTokenSource>();

  const clearTrips = useCallback(() => {
    setTripPatterns([]);
  }, [setTripPatterns]);

  const search = useCallback(
    (cursor?: string, existingTrips?: TripPattern[]) => {
      const currentCancelTokenSource = CancelToken.source();
      setCancelTokenSource(currentCancelTokenSource);
      let allTripPatterns = existingTrips ?? [];
      (async function () {
        if (fromLocation && toLocation) {
          try {
            setSearchState('searching');
            let performedSearchesCount = 0;
            let tripsFoundCount = 0;
            while (tripsFoundCount < 10 && performedSearchesCount < 5) {
              const searchInput = cursor
                ? {cursor}
                : {
                    searchTime: searchTime ?? {
                      option: 'now',
                      date: new Date().toISOString(),
                    },
                  };

              if (searchInput.searchTime?.date) {
                setTimeOfSearch(searchInput.searchTime.date);
              }

              const results = await doSearch(
                fromLocation,
                toLocation,
                searchInput,
                currentCancelTokenSource,
              );

              tripsFoundCount += results.trip.tripPatterns.length;
              allTripPatterns = allTripPatterns.concat(
                results.trip.tripPatterns,
              );
              setTripPatterns(allTripPatterns);
              performedSearchesCount++;
              cursor = results.trip.nextPageCursor;
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

      return () => {
        currentCancelTokenSource.cancel(
          'New search to replace previous search',
        );
      };
    },
    [fromLocation, toLocation, searchTime],
  );

  useEffect(() => search(), [search]);

  const refresh = useCallback(() => {
    if (cancelTokenSource) {
      cancelTokenSource?.cancel('Trip search cancelled');
    }
    clearTrips();
    return search();
  }, [cancelTokenSource, clearTrips, search]);

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
  {searchTime, cursor}: SearchInput,
  cancelToken: CancelTokenSource,
) {
  const searchDate = searchTime
    ? searchTime.option !== 'now'
      ? searchTime.date
      : new Date().toISOString()
    : undefined;

  const query: TripsQueryVariables = {
    from: fromLocation,
    to: toLocation,
    cursor,
    when: searchDate,
  };

  Bugsnag.leaveBreadcrumb('searching', {
    fromLocation: stringifyLocation(fromLocation),
    toLocation: stringifyLocation(toLocation),
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
