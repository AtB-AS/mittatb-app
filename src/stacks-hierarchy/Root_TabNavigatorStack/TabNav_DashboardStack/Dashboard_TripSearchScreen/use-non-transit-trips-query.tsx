import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {nonTransitTripSearch} from '@atb/api/bff/trips';
import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {TripsPropsBase, createTripsQuery} from './use-trips-infinite-query';
import {NonTransitTripsQueryVariables} from '@atb/api/types/generated/TripsQuery';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export type NonTransitTripsQueryProps = TripsPropsBase & {
  directModes: StreetMode[];
};

export const useNonTransitTripsQuery = (
  nonTransitTripsQueryProps: NonTransitTripsQueryProps,
  enabled: boolean,
) => {
  const {isNonTransitTripSearchEnabled} = useFeatureTogglesContext();
  return useQuery({
    queryKey: ['NON_TRANSIT_TRIPS_QUERY_KEY', nonTransitTripsQueryProps],
    queryFn: ({signal}) =>
      nonTransitTripSearch(createNonTransitQuery(nonTransitTripsQueryProps), {
        signal,
      }),
    enabled: enabled && isNonTransitTripSearchEnabled,
    staleTime: 30 * ONE_MINUTE_MS,
    gcTime: 30 * ONE_MINUTE_MS,
  });
};

function createNonTransitQuery(
  nonTransitTripsQueryProps: NonTransitTripsQueryProps,
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
    directModes: nonTransitTripsQueryProps.directModes,
  };
}
