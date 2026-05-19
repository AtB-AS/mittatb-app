import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {refreshSingleTrip} from '@atb/api/bff/trips';
import {TripPattern} from '@atb/api/types/trips';
import {ErrorResponse} from '@atb-as/utils';
import {getTripPatternKey} from './utils';
import {getTripPatternStatus} from '@atb/screen-components/travel-card';

export function useRefreshTripQuery(
  tripPattern: TripPattern,
  enabled: boolean = true,
) {
  const isEnded = getTripPatternStatus(tripPattern) === 'ended';
  return useQuery<TripPattern | null, ErrorResponse>({
    queryKey: ['refreshTrip', getTripPatternKey(tripPattern)],
    queryFn: async () => {
      const res = await refreshSingleTrip(tripPattern);
      console.log(
        new Date().toISOString(),
        'Refreshing trip pattern from ',
        tripPattern.legs[0].fromPlace.name,
        'to',
        tripPattern.legs[tripPattern.legs.length - 1].toPlace.name,
        'new status:',
        res.status,
      );
      return res;
    },
    refetchInterval: ONE_SECOND_MS * 20,
    gcTime: ONE_HOUR_MS,
    enabled: enabled && !isEnded,
  });
}
