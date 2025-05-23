import {Location} from '@atb/modules/favorites';
import {TravelSearchFiltersSelectionType} from '@atb/modules/travel-search-filters';
import {
  Modes,
  StreetMode,
  TransportMode,
  TransportModes,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {TripsQueryVariables} from '@atb/api/types/generated/TripsQuery';
import {flatMap} from '@atb/utils/array';
import {isDefined} from '@atb/utils/presence';
import type {DateOptionAndValue} from '@atb/components/date-selection';
import {TravelSearchTransportModesType} from '@atb-as/config-specs';
import {enumFromString} from '@atb/utils/enum-from-string';
import {FeatureCategory} from '@atb/sdk';
import type {SearchInput} from '@atb/modules/trip-search';

export const defaultJourneyModes = {
  accessMode: StreetMode.Foot,
  directMode: StreetMode.Foot,
  egressMode: StreetMode.Foot,
};

const isVenue = (location: Location): boolean => {
  return 'layer' in location && location.layer === 'venue';
};

const isGroupOfStopPlaces = (location: Location): boolean => {
  return (
    'category' in location &&
    !!location.category?.length &&
    location.category[0] === FeatureCategory.GROUP_OF_STOP_PLACES
  );
};

export const getSearchPlace = (location: Location) => {
  return location.resultType === 'search' &&
    (isVenue(location) || isGroupOfStopPlaces(location))
    ? location.id
    : undefined;
};

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

export function createQuery(
  fromLocation: Location,
  toLocation: Location,
  {searchTime, cursor}: SearchInput,
  arriveBy: boolean,
  travelSearchFiltersSelection: TravelSearchFiltersSelectionType | undefined,
  journeySearchModes?: Modes,
): TripsQueryVariables {
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

export const sanitizeSearchTime = (
  searchTime: DateOptionAndValue<'now' | 'departure' | 'arrival'>,
) =>
  searchTime.option === 'now'
    ? {...searchTime, date: new Date().toISOString()}
    : searchTime;
