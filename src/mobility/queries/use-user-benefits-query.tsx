import {useQuery} from '@tanstack/react-query';
import {getBenefitsForUser} from '@atb/mobility/api/api';
import {useAuthState} from '@atb/auth';

// Caching user benefits for one minute will provide some performance gains, as benefits do not have to be
// reloaded while the user is navigating in the map and clicking different vehicles or stations.
// However, the cache time cannot be too long, since we want benefits to be reloaded if the user buys a
// ticket that is eligible for benefits.
import {ONE_MINUTE_MS} from '@atb/utils/durations.ts';

export const useUserBenefitsQuery = (enabled: boolean) => {
  const {userId, authStatus} = useAuthState();
  return useQuery({
    queryKey: ['mobilityUserBenefits', userId],
    queryFn: getBenefitsForUser,
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
    enabled: enabled && authStatus === 'authenticated',
  });
};
