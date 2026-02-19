import {TripPattern} from '@atb/api/types/trips';
import {toAxiosErrorKind} from '@atb/api/utils';
import {Location} from '@atb/modules/favorites';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useSearchHistoryContext} from '@atb/modules/search-history';
import type {SearchStateType, TripSearchTime} from '../types';

import {isValidTripLocations} from '@atb/utils/location';
import {useCallback, useEffect, useMemo, useState} from 'react';
import type {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import type {TripPatternWithKey} from '@atb/screen-components/travel-details-screens';
import {useJourneyModes} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/hooks';
import {TripsProps, useTripsInfiniteQuery} from './use-trips-infinite-query';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {sanitizeSearchTime} from './utils';
import Bugsnag from '@bugsnag/react-native';
import {useStablePreviousValue} from '@atb/utils/use-stable-previous-value';

export function useTrips(
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  searchTime: TripSearchTime,
  travelSearchFiltersSelection: TravelSearchFiltersSelectionType | undefined,
): {
  tripPatterns: TripPatternWithKey[];
  timeOfLastSearch: string;
  loadMoreTrips: (() => void) | undefined;
  refetchTrips: () => void;
  tripsSearchState: SearchStateType;
  tripsIsError: boolean;
  tripsIsNetworkError: boolean;
} {
  const {
    tripsSearch_max_number_of_chained_searches: config_max_performed_searches,
    tripsSearch_target_number_of_initial_hits: config_target_initial_hits,
    tripsSearch_target_number_of_page_hits: config_target_page_hits,
  } = useRemoteConfigContext();
  const [
    numberOfHitsBeforeCurrentSearchLoop,
    setNumberOfHitsBeforeCurrentSearchLoop,
  ] = useState(0);
  const [
    performedSearchesCountBeforeCurrentSearchLoop,
    setPerformedSearchesCountBeforeCurrentSearchLoop,
  ] = useState(0);

  const journeySearchModes = useJourneyModes();
  const {addJourneySearchEntry} = useSearchHistoryContext();

  const analytics = useAnalyticsContext();

  const arriveBy = searchTime.option === 'arrival';

  const tripsProps: TripsProps = useMemo(
    () => ({
      fromLocation,
      toLocation,
      searchTime: sanitizeSearchTime(searchTime),
      arriveBy,
      travelSearchFiltersSelection,
      journeySearchModes,
    }),
    [
      arriveBy,
      fromLocation,
      journeySearchModes,
      searchTime,
      toLocation,
      travelSearchFiltersSelection,
    ],
  );

  const tripLocationsAreValid = isValidTripLocations(fromLocation, toLocation);

  const {
    data: tripsData,
    isFetching: tripsIsFetching,
    refetch: refetchTrips,
    isError: tripsIsError,
    error: tripsError,
    hasNextPage,
    fetchNextPage,
  } = useTripsInfiniteQuery(tripsProps, tripLocationsAreValid);

  const tripPatterns = useMemo(
    () =>
      filterDuplicateTripPatterns(
        tripsData?.pages.flatMap((page) =>
          decorateTripPatternWithKey(page.trip.tripPatterns),
        ) ?? [],
      ),
    [tripsData?.pages],
  );

  const cursor = tripsData?.pageParams;
  const targetNumberOfHits = cursor
    ? config_target_page_hits
    : config_target_initial_hits;

  const numberOfHits = tripPatterns.length;
  const enoughNumberOfHits =
    numberOfHits - numberOfHitsBeforeCurrentSearchLoop >= targetNumberOfHits;

  const performedSearchesCount = tripsData?.pages.length ?? 0;
  const maxPerformedSearchesCountReached =
    performedSearchesCount - performedSearchesCountBeforeCurrentSearchLoop >=
    config_max_performed_searches;

  const shouldLoadMoreTrips =
    tripLocationsAreValid &&
    !enoughNumberOfHits &&
    !maxPerformedSearchesCountReached &&
    hasNextPage;

  useEffect(() => {
    if (shouldLoadMoreTrips) {
      fetchNextPage();
    }
  }, [
    cursor, // check if more pages are needed when a new page is loaded
    fetchNextPage,
    shouldLoadMoreTrips,
  ]);

  const previousShouldLoadMoreTrips =
    useStablePreviousValue(shouldLoadMoreTrips);
  const didJustEndSearchLoop =
    previousShouldLoadMoreTrips && !shouldLoadMoreTrips;

  useEffect(() => {
    if (didJustEndSearchLoop) {
      analytics.logEvent('Trip search', 'Search performed', {
        searchTime: tripsProps.searchTime,
        filtersSelection: toLoggableFiltersSelection(
          travelSearchFiltersSelection,
        ),
        performedSearchesCount:
          performedSearchesCount -
          performedSearchesCountBeforeCurrentSearchLoop, // count only in this search loop
      });
    }
  }, [
    analytics,
    didJustEndSearchLoop,
    performedSearchesCount,
    performedSearchesCountBeforeCurrentSearchLoop,
    travelSearchFiltersSelection,
    tripPatterns.length,
    tripsProps.searchTime,
  ]);

  const shouldSaveSearch =
    tripLocationsAreValid &&
    fromLocation &&
    fromLocation.resultType !== 'geolocation' &&
    toLocation &&
    toLocation.resultType !== 'geolocation';

  useEffect(() => {
    try {
      // Fire and forget add journey search entry if both locations are not from geo
      shouldSaveSearch && addJourneySearchEntry([fromLocation, toLocation]);
    } catch {}
  }, [addJourneySearchEntry, fromLocation, shouldSaveSearch, toLocation]);

  const hasSearched = performedSearchesCount > 0;

  const resultsAreEmpty =
    !tripLocationsAreValid || (hasSearched && tripPatterns.length === 0);

  const tripsSearchState: SearchStateType = tripsIsFetching
    ? 'searching'
    : resultsAreEmpty
      ? 'search-empty-result'
      : hasSearched
        ? 'search-success'
        : 'idle';

  const timeOfLastSearch = tripsProps.searchTime.date;

  const startNewSearchLoop = useCallback(() => {
    // resetting counters changes conditions for shouldLoadMoreTrips, which in turn triggers fetchNextPage in the useEffect
    setNumberOfHitsBeforeCurrentSearchLoop(tripPatterns.length);
    setPerformedSearchesCountBeforeCurrentSearchLoop(performedSearchesCount);
  }, [performedSearchesCount, tripPatterns.length]);

  const loadMoreTrips = hasNextPage ? startNewSearchLoop : undefined;

  const axiosErrorKind = tripsError
    ? toAxiosErrorKind(tripsError.kind)
    : undefined;

  const tripsIsNetworkError =
    axiosErrorKind === 'AXIOS_NETWORK_ERROR' ||
    axiosErrorKind === 'AXIOS_TIMEOUT';

  return useMemo(
    () => ({
      tripPatterns,
      timeOfLastSearch,
      loadMoreTrips,
      refetchTrips,
      tripsSearchState,
      tripsIsError,
      tripsIsNetworkError,
    }),
    [
      loadMoreTrips,
      refetchTrips,
      tripsSearchState,
      timeOfLastSearch,
      tripPatterns,
      tripsIsError,
      tripsIsNetworkError,
    ],
  );
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

function filterDuplicateTripPatterns(
  tripPatterns: TripPatternWithKey[],
): TripPatternWithKey[] {
  const existing = new Map<string, TripPatternWithKey>();
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

function toLoggableFiltersSelection(
  filterSelection: TravelSearchFiltersSelectionType | undefined,
) {
  if (!filterSelection) return;
  return {
    transportModes: filterSelection.transportModes?.map((t) => ({
      [t.id]: t.selected,
    })),
  };
}
