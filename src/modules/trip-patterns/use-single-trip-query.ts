import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {singleTripSearch} from '@atb/api/bff/trips';
import {TripPattern} from '@atb/api/types/trips';
import {ErrorResponse} from '@atb-as/utils';
import {getTripPatternKey} from './utils';

export function useSingleTripQuery(
  tripPattern: TripPattern,
  enabled: boolean = true,
) {
  return useQuery<TripPattern | null, ErrorResponse>({
    queryKey: ['singleTrip', getTripPatternKey(tripPattern)],
    queryFn: async () => {
      return await singleTripSearch(tripPattern.compressedQuery);
    },
    refetchInterval: ONE_SECOND_MS * 20,
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
    enabled,
  });
}
