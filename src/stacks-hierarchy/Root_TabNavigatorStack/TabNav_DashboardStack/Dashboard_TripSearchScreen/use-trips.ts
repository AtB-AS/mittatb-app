import {TripPattern} from '@atb/api/types/trips';
import {toAxiosErrorKind} from '@atb/api/utils';
import {Location} from '@atb/modules/favorites';
import {useSearchHistoryContext} from '@atb/modules/search-history';
import type {SearchStateType, TripSearchTime} from '../types';

import {isValidTripLocations} from '@atb/utils/location';
import {useCallback, useEffect, useMemo} from 'react';
import type {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import type {TripPatternWithKey} from '@atb/screen-components/travel-details-screens';
import {useJourneyModes} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/hooks';
import {TripsProps, useTripsInfiniteQuery} from './use-trips-infinite-query';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {sanitizeSearchTime} from './utils';
import Bugsnag from '@bugsnag/react-native';
import {useStablePreviousValue} from '@atb/utils/use-stable-previous-value';

const MAX_NUMBER_OF_CHAINGED_INITIAL_SEARCHES = 5;
const TARGET_NUMBER_OF_INITIAL_HITS = 8;

/**
 * Hook for fetching trip results with progressive loading for the initial search.
 *
 * For the initial search, the app automatically keeps requesting additional pages
 * until a sufficient number of results is reached (or a maximum number of chained
 * requests is hit). This provides fast feedback to the user while still attempting
 * to fill the list with enough trips.
 *
 * For "load more", this behavior is not needed — only a single additional page is
 * fetched. The BFF already performs its own retries, so extra chaining here would
 * be unnecessary.
 */
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

  const performedSearchesCount = tripsData?.pages.length ?? 0;

  const allowFetchNextPage =
    tripLocationsAreValid && !tripsIsFetching && hasNextPage;

  const shouldAutoLoadMoreInitialTrips =
    allowFetchNextPage &&
    tripPatterns.length < TARGET_NUMBER_OF_INITIAL_HITS &&
    performedSearchesCount < MAX_NUMBER_OF_CHAINGED_INITIAL_SEARCHES;

  useEffect(() => {
    shouldAutoLoadMoreInitialTrips && fetchNextPage();
  }, [
    cursor, // check if more pages are needed when a new page is loaded
    fetchNextPage,
    shouldAutoLoadMoreInitialTrips,
  ]);

  const sendAnalyticsSearchEvent = useCallback(() => {
    analytics.logEvent('Trip search', 'Search performed', {
      searchTime: tripsProps.searchTime,
      filtersSelection: toLoggableFiltersSelection(
        travelSearchFiltersSelection,
      ),
    });
  }, [analytics, travelSearchFiltersSelection, tripsProps.searchTime]);

  const didJustEndChainOfSearches =
    useStablePreviousValue(shouldAutoLoadMoreInitialTrips) &&
    !shouldAutoLoadMoreInitialTrips;

  useEffect(() => {
    didJustEndChainOfSearches && sendAnalyticsSearchEvent();
  }, [didJustEndChainOfSearches, sendAnalyticsSearchEvent]);

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

  const loadNextTripsPage = useCallback(() => {
    if (allowFetchNextPage) {
      fetchNextPage();
      sendAnalyticsSearchEvent();
    }
  }, [allowFetchNextPage, fetchNextPage, sendAnalyticsSearchEvent]);

  const loadMoreTrips = hasNextPage ? loadNextTripsPage : undefined;

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
