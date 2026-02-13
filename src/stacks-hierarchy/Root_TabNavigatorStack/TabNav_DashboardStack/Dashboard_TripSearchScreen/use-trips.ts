import {TripPattern} from '@atb/api/types/trips';
import {toAxiosErrorKind, AxiosErrorKind} from '@atb/api/utils';
import {Location} from '@atb/modules/favorites';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useSearchHistoryContext} from '@atb/modules/search-history';
import type {SearchStateType, TripSearchTime} from '../types';

import {isValidTripLocations} from '@atb/utils/location';
import {useEffect, useMemo} from 'react';
import type {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import type {TripPatternWithKey} from '@atb/screen-components/travel-details-screens';
import {useJourneyModes} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/hooks';
import {TripsProps, useTripsInfiniteQuery} from './use-trips-infinite-query';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {sanitizeSearchTime} from './utils';

export function useTrips(
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  searchTime: TripSearchTime,
  travelSearchFiltersSelection: TravelSearchFiltersSelectionType | undefined,
): {
  tripPatterns: TripPatternWithKey[];
  timeOfLastSearch: string;
  loadMore: (() => void) | undefined;
  refetchTrips: () => void;
  searchState: SearchStateType;
  error?: AxiosErrorKind;
} {
  const {
    tripsSearch_max_number_of_chained_searches: config_max_performed_searches,
    tripsSearch_target_number_of_initial_hits: config_target_initial_hits,
    tripsSearch_target_number_of_page_hits: config_target_page_hits,
  } = useRemoteConfigContext();

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
    error: tripsError,
    hasNextPage,
    fetchNextPage,
  } = useTripsInfiniteQuery(tripsProps, tripLocationsAreValid);

  const tripPatterns = useMemo(
    () =>
      tripsData?.pages.flatMap((page) =>
        decorateTripPatternWithKey(page.trip.tripPatterns),
      ) ?? [],
    [tripsData?.pages],
  );

  const cursor = tripsData?.pageParams;
  const targetNumberOfHits = cursor
    ? config_target_page_hits
    : config_target_initial_hits;

  const performedSearchesCount = tripsData?.pages.length ?? 0;
  const shouldLoadMoreTrips =
    tripLocationsAreValid &&
    tripPatterns.length < targetNumberOfHits &&
    performedSearchesCount < config_max_performed_searches &&
    hasNextPage;

  useEffect(() => {
    if (shouldLoadMoreTrips) {
      fetchNextPage();
    } else {
      analytics.logEvent('Trip search', 'Search performed', {
        searchTime: tripsProps.searchTime,
        filtersSelection: toLoggableFiltersSelection(
          travelSearchFiltersSelection,
        ),
        numberOfHits: tripPatterns.length,
      });
    }
  }, [
    analytics,
    cursor, // check if more pages are needed when a new page is loaded
    fetchNextPage,
    tripsProps.searchTime,
    shouldLoadMoreTrips,
    travelSearchFiltersSelection,
    tripPatterns.length,
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

  const searchState: SearchStateType = tripsIsFetching
    ? 'searching'
    : resultsAreEmpty
      ? 'search-empty-result'
      : hasSearched
        ? 'search-success'
        : 'idle';

  const timeOfLastSearch = tripsProps.searchTime.date;

  const loadMore = hasNextPage ? fetchNextPage : undefined;

  const error = tripsError ? toAxiosErrorKind(tripsError.kind) : undefined;

  return useMemo(
    () => ({
      tripPatterns,
      timeOfLastSearch,
      loadMore,
      refetchTrips,
      searchState,
      error,
    }),
    [
      error,
      loadMore,
      refetchTrips,
      searchState,
      timeOfLastSearch,
      tripPatterns,
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
