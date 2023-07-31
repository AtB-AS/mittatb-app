import {Location} from '@atb/favorites';
import {TripSearchPreferences} from '@atb/preferences';
import {TravelSearchFiltersSelectionType} from '@atb/travel-search-filters';
import {
  Modes,
  TransportMode,
  TransportModes,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {TripsQueryVariables} from '@atb/api/types/generated/TripsQuery';
import {flatMap} from '@atb/utils/array';
import {TravelSearchTransportModes} from '@atb-as/config-specs';
import {enumFromString} from '@atb/utils/enum-from-string';
import {SearchTime} from '@atb/journey-date-picker';
import {defaultJourneyModes} from './hooks';

export type TimeSearch = {
  searchTime: SearchTime;
  cursor?: never;
};

export type CursorSearch = {
  searchTime?: never;
  cursor: string;
};

export type SearchInput = TimeSearch | CursorSearch;

export function createQuery(
  fromLocation: Location,
  toLocation: Location,
  {searchTime, cursor}: SearchInput,
  arriveBy: boolean,
  tripSearchPreferences: TripSearchPreferences | undefined,
  travelSearchFiltersSelection: TravelSearchFiltersSelectionType | undefined,
  journeySearchModes?: Modes,
): TripsQueryVariables {
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

  const query = {
    from,
    to,
    cursor,
    when: searchTime?.date,
    arriveBy,
    transferPenalty: tripSearchPreferences?.transferPenalty,
    waitReluctance: tripSearchPreferences?.waitReluctance,
    walkReluctance: tripSearchPreferences?.walkReluctance,
    walkSpeed: tripSearchPreferences?.walkSpeed,
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
  return query;
}

function transportModeToEnum(
  modes: TravelSearchTransportModes[],
): TransportModes[] {
  return modes.map((internal) => {
    return {
      transportMode: enumFromString(TransportMode, internal.transportMode),
      transportSubModes: internal.transportSubModes
        ?.map((submode) => enumFromString(TransportSubmode, submode))
        .filter(Boolean) as TransportSubmode[],
    };
  });
}

export const sanitizeSearchTime = (searchTime: SearchTime) =>
  searchTime.option === 'now'
    ? {...searchTime, date: new Date().toISOString()}
    : searchTime;
