import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {refreshSingleTrip} from '@atb/api/bff/trips';
import {Leg, TripPattern, isStaleLeg} from '@atb/api/types/trips';
import {ErrorResponse} from '@atb-as/utils';
import {getTripPatternKey} from './utils';

export function useRefreshTripQuery(
  tripPattern: TripPattern,
  enabled: boolean = true,
) {
  return useQuery<TripPattern | null, ErrorResponse>({
    queryKey: ['refreshTrip', getTripPatternKey(tripPattern)],
    queryFn: async () => {
      const response = await refreshSingleTrip(tripPattern);

      // Merge stale legs with locally cached legs
      const mergedLegs: Leg[] = response.legs.map((leg, index) => {
        if (isStaleLeg(leg)) {
          return tripPattern.legs[index];
        }
        return leg;
      });

      return {
        ...tripPattern,
        ...response,
        legs: mergedLegs,
      } as TripPattern;
    },
    refetchInterval: ONE_SECOND_MS * 20,
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
    enabled,
  });
}
