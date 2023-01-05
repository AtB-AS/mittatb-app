import {Location} from '@atb/favorites/types';
import {
  DateString,
  SearchTime,
} from '@atb/screens/Dashboard/journey-date-picker';
import {TripPattern} from '@atb/api/types/trips';
import {
  SearchStateType,
  TripPatternWithKey,
} from '@atb/screens/Dashboard/types';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useCallback, useEffect, useRef, useState} from 'react';
import {CancelToken, isCancel} from '@atb/api';
import {CancelTokenSource} from 'axios';
import {TripsQueryVariables} from '@atb/api/types/generated/TripsQuery';
import {tripsSearch} from '@atb/api/trips_v2';
import Bugsnag from '@bugsnag/react-native';
import {useSearchHistory} from '@atb/search-history';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {TripSearchPreferences, usePreferences} from '@atb/preferences';
import {isValidTripLocations} from '@atb/utils/location';
import type {TravelSearchFiltersType} from '@atb/screens/Dashboard/types';
import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {flatMap} from '@atb/utils/array';

export default function useTripsQuery(
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  searchTime: SearchTime = {
    option: 'now',
    date: new Date().toISOString(),
  },
  selectedFilters: TravelSearchFiltersType | undefined,
): {
  tripPatterns: TripPatternWithKey[];
  timeOfLastSearch: DateString;
  loadMore: (() => {}) | undefined;
  clear: () => void;
  searchState: SearchStateType;
  error?: ErrorType;
} {
  const [timeOfSearch, setTimeOfSearch] = useState<string>(
    new Date().toISOString(),
  );

  const [tripPatterns, setTripPatterns] = useState<TripPatternWithKey[]>([]);
  const [pageCursor, setPageCursor] = useState<string>();
  const [errorType, setErrorType] = useState<ErrorType>();
  const [searchState, setSearchState] = useState<SearchStateType>('idle');
  const cancelTokenRef = useRef<CancelTokenSource>();
  const {addJourneySearchEntry} = useSearchHistory();
  const {
    preferences: {tripSearchPreferences},
  } = usePreferences();

  const {
    tripsSearch_max_number_of_chained_searches: config_max_performed_searches,
    tripsSearch_target_number_of_initial_hits: config_target_inital_hits,
    tripsSearch_target_number_of_page_hits: config_target_page_hits,
  } = useRemoteConfig();

  const clearTrips = useCallback(() => {
    setTripPatterns([]);
  }, [setTripPatterns]);

  const search = useCallback(
    (cursor?: string, existingTrips?: TripPatternWithKey[]) => {
      cancelTokenRef.current?.cancel('New search starting');
      const cancelTokenSource = CancelToken.source();
      let allTripPatterns = existingTrips ?? [];
      if (!cursor) setTripPatterns([]);

      const targetNumberOfHits = cursor
        ? config_target_page_hits
        : config_target_inital_hits;

      const sanitizedSearchTime =
        searchTime.option === 'now'
          ? {...searchTime, date: new Date().toISOString()}
          : searchTime;

      (async function () {
        if (fromLocation && toLocation) {
          try {
            setSearchState('searching');
            let performedSearchesCount = 0;
            let tripsFoundCount = 0;

            if (!isValidTripLocations(fromLocation, toLocation)) {
              setSearchState('search-empty-result');
              return;
            }

            try {
              // Fire and forget add journey search entry if both locations are not from geo
              if (
                fromLocation.resultType !== 'geolocation' &&
                toLocation.resultType !== 'geolocation'
              )
                await addJourneySearchEntry([fromLocation, toLocation]);
            } catch (e) {}

            let nextPageAvailable = true;
            while (
              tripsFoundCount < targetNumberOfHits &&
              performedSearchesCount < config_max_performed_searches &&
              nextPageAvailable
            ) {
              const searchInput: SearchInput = cursor
                ? {cursor}
                : {searchTime: sanitizedSearchTime};

              if (searchInput.searchTime?.date) {
                setTimeOfSearch(searchInput.searchTime.date);
              }

              const arriveBy = searchTime.option === 'arrival';

              const results = await doSearch(
                fromLocation,
                toLocation,
                arriveBy,
                searchInput,
                cancelTokenSource,
                tripSearchPreferences,
                selectedFilters,
              );

              const tripPatternsWithKeys = decorateTripPatternWithKey(
                results.trip.tripPatterns,
              );

              const countBeforeConcat = allTripPatterns.length;
              allTripPatterns = allTripPatterns.concat(tripPatternsWithKeys);
              allTripPatterns = filterDuplicateTripPatterns(allTripPatterns);

              setTripPatterns(allTripPatterns);
              tripsFoundCount += allTripPatterns.length - countBeforeConcat;
              performedSearchesCount++;

              cursor =
                searchTime.option === 'arrival'
                  ? results.trip.previousPageCursor
                  : results.trip.nextPageCursor;
              nextPageAvailable = !!cursor;
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
    [fromLocation, toLocation, searchTime, selectedFilters],
  );

  useEffect(() => search(), [search]);

  const loadMore = useCallback(() => {
    return search(pageCursor, tripPatterns);
  }, [search, pageCursor, tripPatterns]);

  return {
    tripPatterns,
    timeOfLastSearch: timeOfSearch,
    loadMore: !!pageCursor ? loadMore : undefined,
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
  tripSearchPreferences: TripSearchPreferences | undefined,
  travelSearchFilters: TravelSearchFiltersType | undefined,
) {
  const from = {
    ...fromLocation,
    place:
      fromLocation.resultType === 'search' && fromLocation.layer === 'venue'
        ? fromLocation.id
        : undefined,
  };
  const to = {
    ...toLocation,
    place:
      toLocation.resultType === 'search' && toLocation.layer === 'venue'
        ? toLocation.id
        : undefined,
  };

  const query: TripsQueryVariables = {
    from,
    to,
    cursor,
    when: searchTime?.date,
    arriveBy,
    transferPenalty: tripSearchPreferences?.transferPenalty,
    waitReluctance: tripSearchPreferences?.waitReluctance,
    walkReluctance: tripSearchPreferences?.walkReluctance,
    walkSpeed: tripSearchPreferences?.walkSpeed,
  };

  if (travelSearchFilters?.transportModes) {
    query.modes = {
      accessMode: StreetMode.Foot,
      directMode: StreetMode.Foot,
      egressMode: StreetMode.Foot,
      transportModes: flatMap(
        travelSearchFilters.transportModes,
        (tm) => tm.modes,
      ),
    };
  }

  Bugsnag.leaveBreadcrumb('searching', {
    fromLocation: query.from,
    toLocation: query.to,
    arriveBy: query.arriveBy,
    when: query.when || '',
    cursor: query.cursor || '',
    transferPenalty: query.transferPenalty || '',
    waitReluctance: query.waitReluctance || '',
    walkReluctance: query.walkReluctance || '',
    walkSpeed: query.walkSpeed || '',
  });

  return tripsSearch(query, {
    cancelToken: cancelToken.token,
  });
}
function generateKeyFromTripPattern(tripPattern: TripPattern) {
  const firstServiceLeg = tripPattern.legs.find((leg) => leg.serviceJourney);
  const key =
    (firstServiceLeg?.aimedStartTime ?? '') +
    tripPattern.legs
      .map((leg) => {
        return leg.toPlace.longitude.toString() + leg.toPlace.latitude;
      })
      .join('-');

  return key;
}

function decorateTripPatternWithKey(
  tripPatterns: TripPattern[],
): TripPatternWithKey[] {
  return tripPatterns.map((tp) => {
    return {
      ...tp,
      key: generateKeyFromTripPattern(tp),
    };
  });
}

function filterDuplicateTripPatterns(
  tripPatterns: TripPatternWithKey[],
): TripPatternWithKey[] {
  let existing = new Map<string, TripPatternWithKey>();
  return tripPatterns.filter((tp) => {
    if (existing.has(tp.key)) {
      Bugsnag.leaveBreadcrumb(
        'Removed duplicate tripPattern from search results',
        {
          original: existing.get(tp.key),
          duplicate: tp,
        },
      );
      return false;
    }
    existing.set(tp.key, tp);
    return true;
  });
}
