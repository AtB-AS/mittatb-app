import {InfiniteData, useInfiniteQuery} from '@tanstack/react-query';
import {Location} from '@atb/modules/favorites';
import {
  defaultJourneyModes,
  getSearchPlace,
  transportModeToEnum,
} from './utils';
import {tripsSearch} from '@atb/api/bff/trips';
import type {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import {
  Modes,
  TransportMode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  TripsQuery,
  TripsQueryVariables,
} from '@atb/api/types/generated/TripsQuery';
import {isDefined} from '@atb/utils/presence';

import {flatMap} from '@atb/utils/array';
import {TripSearchTime} from '../types';
import {ErrorResponse} from '@atb-as/utils';

export type TripsProps = {
  fromLocation?: Location;
  toLocation?: Location;
  arriveBy: boolean;
  searchTime: TripSearchTime;
  travelSearchFiltersSelection?: TravelSearchFiltersSelectionType;
  journeySearchModes: Modes;
};

export const useTripsInfiniteQuery = (
  tripsProps: TripsProps,
  enabled: boolean,
) => {
  const queryKey = ['TRIPS_INFINITE_QUERY_KEY', tripsProps];

  return useInfiniteQuery<
    TripsQuery,
    ErrorResponse,
    InfiniteData<TripsQuery, unknown>,
    typeof queryKey,
    string | undefined
  >({
    queryKey,
    queryFn: ({pageParam: cursor, signal}) =>
      tripsSearch(createTripsQuery(tripsProps, cursor), {
        signal,
      }),
    maxPages: 100,
    enabled,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage?.trip?.nextPageCursor,
  });
};

function createTripsQuery(
  tripsProps: TripsProps,
  cursor?: string,
): TripsQueryVariables {
  const {
    fromLocation,
    toLocation,
    searchTime,
    arriveBy,
    travelSearchFiltersSelection,
    journeySearchModes,
  } = tripsProps;

  const from = {
    ...fromLocation,
    place: getSearchPlace(fromLocation),
  };
  const to = {
    ...toLocation,
    place: getSearchPlace(toLocation),
  };

  const query: TripsQueryVariables = {
    from,
    to,
    cursor,
    when: searchTime?.date,
    arriveBy,
    modes: journeySearchModes,
  };

  if (travelSearchFiltersSelection?.transportModes) {
    const selectedFilters = travelSearchFiltersSelection.transportModes.filter(
      (m) => m.selected,
    );

    const includeFlexibleTransport = selectedFilters.some(
      (sf) => sf.id === TransportMode.Bus, // filter flex transport on bus filter
    );

    query.modes = {
      ...(includeFlexibleTransport ? journeySearchModes : defaultJourneyModes),
      transportModes: flatMap(selectedFilters, (tm) =>
        transportModeToEnum(tm.modes),
      ),
    };
  }

  if (travelSearchFiltersSelection?.travelSearchPreferences) {
    travelSearchFiltersSelection.travelSearchPreferences.forEach(
      (preference) => {
        const value = preference.options.find(
          (o) => o.id === preference.selectedOption,
        )?.value;
        if (isDefined(value)) {
          query[preference.type] = value;
        }
      },
    );
  }
  return query;
}
