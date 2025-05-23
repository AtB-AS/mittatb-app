import {TripPattern} from '@atb/api/types/trips';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {Location} from '@atb/modules/favorites';
import {useSearchHistoryContext} from '@atb/modules/search-history';

import Bugsnag from '@bugsnag/react-native';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import {TripPatternWithKey} from '@atb/screen-components/travel-details-screens';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import {isValidTripLocations} from '@atb/utils/location';
import {createQuery, sanitizeSearchTime} from './utils';
import type {SearchInput, SearchStateType, TripSearchTime} from './types';
import {tripsSearch} from '@atb/api/trips';
import {useJourneyModes} from '@atb/modules/trip-search';

export function useTripsQuery(
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  searchTime: TripSearchTime = {
    option: 'now',
    date: new Date().toISOString(),
  },
  filtersSelection: TravelSearchFiltersSelectionType | undefined,
): {
  tripPatterns: TripPatternWithKey[];
  timeOfLastSearch: string;
  loadMore: (() => void) | undefined;
  searchState: SearchStateType;
  error?: ErrorType;
} {
  const [timeOfSearch, setTimeOfSearch] = useState<string>(
    new Date().toISOString(),
  );

  const journeySearchModes = useJourneyModes();
  const {addJourneySearchEntry} = useSearchHistoryContext();
  const analytics = useAnalyticsContext();

  const fetchTrips = async ({pageParam}: {pageParam?: string}) => {
    if (
      !fromLocation ||
      !toLocation ||
      !isValidTripLocations(fromLocation, toLocation)
    ) {
      throw new Error('Invalid trip locations');
    }

    const sanitizedSearchTime = sanitizeSearchTime(searchTime);
    const searchInput: SearchInput = pageParam
      ? {cursor: pageParam}
      : {searchTime: sanitizedSearchTime};

    if (searchInput.searchTime?.date) {
      setTimeOfSearch(searchInput.searchTime.date);
    }

    const arriveBy = searchTime.option === 'arrival';
    const query = createQuery(
      fromLocation,
      toLocation,
      searchInput,
      arriveBy,
      filtersSelection,
      journeySearchModes,
    );

    Bugsnag.leaveBreadcrumb('searching', {
      fromLocation: query.from,
      toLocation: query.to,
      arriveBy: query.arriveBy,
      when: query.when ?? '',
      cursor: query.cursor ?? '',
      transferSlack: query.transferSlack ?? '',
      transferPenalty: query.transferPenalty ?? '',
      waitReluctance: query.waitReluctance ?? '',
      walkReluctance: query.walkReluctance ?? '',
      walkSpeed: query.walkSpeed ?? '',
    });

    const results = await tripsSearch(query);
    const tripPatternsWithKeys = decorateTripPatternWithKey(
      results.trip.tripPatterns,
    );

    return {
      tripPatterns: tripPatternsWithKeys,
      nextPageCursor:
        searchTime.option === 'arrival'
          ? results.trip.previousPageCursor
          : results.trip.nextPageCursor,
    };
  };

  const {
    tripsSearch_max_number_of_chained_searches: config_max_performed_searches,
    tripsSearch_target_number_of_initial_hits: config_target_initial_hits,
  } = useRemoteConfigContext();

  const {data, error, fetchNextPage, hasNextPage, isFetching, status} =
    useInfiniteQuery(
      ['trips', fromLocation, toLocation, searchTime, filtersSelection],
      fetchTrips,
      {
        getNextPageParam: (lastPage) => lastPage.nextPageCursor,
        retry: false,
      },
    );

  const tripPatterns = useMemo(
    () =>
      data
        ? filterDuplicateTripPatterns(
            data.pages.flatMap((page) => page.tripPatterns),
          )
        : [],
    [data],
  );

  // Automatically fetch more pages if the total results are below the target
  useEffect(() => {
    if (data && hasNextPage) {
      const totalResults = data.pages.flatMap(
        (page) => page.tripPatterns,
      ).length;
      if (
        totalResults < config_target_initial_hits &&
        data.pages.length < config_max_performed_searches
      ) {
        fetchNextPage();
      }
    }
  }, [
    data,
    hasNextPage,
    fetchNextPage,
    config_target_initial_hits,
    config_max_performed_searches,
  ]);

  const addJourneySearchEntryStable = useCallback(addJourneySearchEntry, [
    addJourneySearchEntry,
  ]);

  useEffect(() => {
    if (!fromLocation || !toLocation) return;
    try {
      // Fire and forget add journey search entry if both locations are not from geo
      if (
        fromLocation.resultType !== 'geolocation' &&
        toLocation.resultType !== 'geolocation'
      ) {
        (async () =>
          await addJourneySearchEntryStable([fromLocation, toLocation]))();
      }
    } catch (e) {}
  }, [fromLocation, toLocation, addJourneySearchEntryStable]);

  useDoOnceWhen(
    () => {
      analytics.logEvent('Trip search', 'Search performed', {
        searchTime,
        filtersSelection: toLoggableFiltersSelection(filtersSelection),
        numberOfHits: tripPatterns.length,
      });
    },
    status === 'success' && tripPatterns.length > 0,
    true,
  );

  useEffect(() => {}, [
    status,
    tripPatterns,
    analytics,
    searchTime,
    filtersSelection,
  ]);

  return {
    tripPatterns,
    timeOfLastSearch: timeOfSearch,
    loadMore: hasNextPage ? fetchNextPage : undefined,
    searchState: isFetching
      ? 'searching'
      : tripPatterns.length === 0
      ? 'search-empty-result'
      : 'search-success',
    error: error ? getAxiosErrorType(error) : undefined,
  };
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
    flexibleTransportEnabled: filterSelection.flexibleTransport?.enabled,
  };
}
