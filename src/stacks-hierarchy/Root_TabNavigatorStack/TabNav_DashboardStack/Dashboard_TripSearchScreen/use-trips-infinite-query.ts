import {useInfiniteQuery} from '@tanstack/react-query';
import {Location} from '@atb/modules/favorites';
import {defaultJourneyModes, getSearchPlace} from './utils';
import {tripsSearch} from '@atb/api/bff/trips';
import type {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import {
  Modes,
  TransportMode,
  TransportModes,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  TripsQuery,
  TripsQueryVariables,
} from '@atb/api/types/generated/TripsQuery';
import {isDefined} from '@atb/utils/presence';
import {TravelSearchTransportModesType} from '@atb-as/config-specs';
import {enumFromString} from '@atb/utils/enum-from-string';
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
) =>
  useInfiniteQuery<TripsQuery, ErrorResponse>({
    queryKey: ['TRIPS_INFINITE_QUERY_KEY', tripsProps],
    queryFn: async ({pageParam: cursor, signal}) => {
      const query = createTripsQuery(
        tripsProps,
        typeof cursor === 'string' ? cursor : undefined,
      );

      return await tripsSearch(query, {
        signal,
      });
    },
    enabled,
    initialPageParam: '',
    maxPages: 100,
    getNextPageParam: (lastPage) => lastPage.trip.nextPageCursor,
    getPreviousPageParam: (firstPage) => firstPage.trip.previousPageCursor,
  });

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
    cursor: isDefined(cursor) && cursor !== '' ? cursor : undefined,
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

function transportModeToEnum(
  modes: TravelSearchTransportModesType[],
): TransportModes[] {
  return modes.map((internal) => {
    return {
      transportMode: enumFromString(TransportMode, internal.transportMode),
      transportSubModes: internal.transportSubModes
        ?.map((submode) => enumFromString(TransportSubmode, submode))
        .filter(isDefined),
    };
  });
}
