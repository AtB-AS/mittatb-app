import {InfiniteData, useInfiniteQuery} from '@tanstack/react-query';

import {
  defaultJourneyModes,
  getSearchPlace,
  transportModeToEnum,
} from './utils';
import {tripsSearch} from '@atb/api/bff/trips';
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

import {ErrorResponse} from '@atb-as/utils';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {TripsProps} from './use-trips';

export type TripsInfiniteQueryProps = TripsProps & {
  journeySearchModes: Modes;
};

export const useTripsInfiniteQuery = (
  tripsInfiniteQueryProps: TripsInfiniteQueryProps,
  enabled: boolean,
) => {
  const queryKey = ['TRIPS_INFINITE_QUERY_KEY', tripsInfiniteQueryProps];

  return useInfiniteQuery<
    TripsQuery,
    ErrorResponse,
    InfiniteData<TripsQuery, unknown>,
    typeof queryKey,
    string | undefined
  >({
    queryKey,
    queryFn: ({pageParam: cursor, signal}) =>
      tripsSearch(createTripsQuery(tripsInfiniteQueryProps, cursor), {
        signal,
      }),
    maxPages: 100,
    enabled,
    staleTime: 30 * ONE_MINUTE_MS,
    gcTime: 30 * ONE_MINUTE_MS,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage?.trip?.nextPageCursor,
  });
};

export function createTripsQuery(
  tripsInfiniteQueryProps: TripsInfiniteQueryProps,
  cursor?: string,
): TripsQueryVariables {
  const {
    fromLocation,
    toLocation,
    searchTime,
    arriveBy,
    travelSearchFiltersSelection,
    journeySearchModes,
  } = tripsInfiniteQueryProps;

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
