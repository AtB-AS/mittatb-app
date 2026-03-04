import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {nonTransitTripSearch} from '@atb/api/bff/trips';
import {getSearchPlace} from './utils';
import {TravelSearchPreferenceWithSelectionType} from '@atb/modules/travel-search-filters';
import {TravelSearchPreferenceParameterType} from '@atb-as/config-specs';
import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {AllTripsProps} from './use-trips-infinite-query';

export type NonTransitTripsQueryProps = AllTripsProps & {
  directModes: StreetMode[];
};

export const useNonTransitTripsQuery = (
  nonTransitTripsQueryProps: NonTransitTripsQueryProps,
  enabled: boolean,
) =>
  useQuery({
    queryKey: ['NON_TRANSIT_TRIPS_QUERY_KEY', nonTransitTripsQueryProps],
    queryFn: ({signal}) =>
      nonTransitTripSearch(createNonTransitQuery(nonTransitTripsQueryProps), {
        signal,
      }),
    enabled,
    staleTime: 30 * ONE_MINUTE_MS,
    gcTime: 30 * ONE_MINUTE_MS,
  });

export function createNonTransitQuery(
  nonTransitTripsQueryProps: NonTransitTripsQueryProps,
) {
  const {
    fromLocation,
    toLocation,
    searchTime = {
      option: 'now',
      date: new Date().toISOString(),
    },
    travelSearchFiltersSelection,
    directModes,
  } = nonTransitTripsQueryProps;

  const from = {
    ...fromLocation,
    place: getSearchPlace(fromLocation),
  };
  const to = {
    ...toLocation,
    place: getSearchPlace(toLocation),
  };

  const walkSpeed = getPreferenceFromFilter(
    'walkSpeed',
    travelSearchFiltersSelection?.travelSearchPreferences,
  );

  return {
    from,
    to,
    when: searchTime?.date,
    arriveBy: searchTime.option === 'arrival',
    walkSpeed,
    directModes,
  };
}

const getPreferenceFromFilter = (
  type: TravelSearchPreferenceParameterType,
  filters: TravelSearchPreferenceWithSelectionType[] | undefined,
) => {
  const filterOfType = filters?.find((f) => f.type === type);
  if (!filterOfType) return;
  return filterOfType.options.find((o) => o.id === filterOfType.selectedOption)
    ?.value;
};
