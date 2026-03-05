import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {nonTransitTripSearch} from '@atb/api/bff/trips';
import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {createTripsQuery} from './use-trips-infinite-query';
import {NonTransitTripsQueryVariables} from '@atb/api/types/generated/TripsQuery';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {TripsProps} from './use-trips';

const NON_TRANSIT_DIRECT_MODES: StreetMode[] = [
  StreetMode.Foot,
  StreetMode.BikeRental,
  StreetMode.Bicycle,
];

export const useNonTransitTripsQuery = (
  tripsProps: TripsProps,
  enabled: boolean,
) => {
  const {isNonTransitTripSearchEnabled} = useFeatureTogglesContext();
  return useQuery({
    queryKey: ['NON_TRANSIT_TRIPS_QUERY_KEY', tripsProps],
    queryFn: ({signal}) =>
      nonTransitTripSearch(createNonTransitQuery(tripsProps), {
        signal,
      }),
    enabled: enabled && isNonTransitTripSearchEnabled,
    staleTime: 30 * ONE_MINUTE_MS,
    gcTime: 30 * ONE_MINUTE_MS,
  });
};

function createNonTransitQuery(
  nonTransitTripsQueryProps: TripsProps,
): NonTransitTripsQueryVariables {
  const {
    cursor: _cursor,
    transferPenalty: _transferPenalty,
    waitReluctance: _waitReluctance,
    walkReluctance: _walkReluctance,
    transferSlack: _transferSlack,
    modes: _modes,
    ...nonTransitTripsQueryBase
  } = createTripsQuery({
    ...nonTransitTripsQueryProps,
    journeySearchModes: {},
  });

  return {
    ...nonTransitTripsQueryBase,
    directModes: NON_TRANSIT_DIRECT_MODES,
  };
}
