import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getFeideConnection} from '@atb/api/identity';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useAuthContext} from '@atb/modules/auth';

export const feideConnectionQueryKey = 'getFeideConnection';

export const useGetFeideConnectionQuery = () => {
  const {isFeideConnectionEnabled} = useFeatureTogglesContext();
  const {userId, authStatus} = useAuthContext();
  return useQuery({
    enabled: isFeideConnectionEnabled && authStatus === 'authenticated',
    queryKey: [feideConnectionQueryKey, userId],
    queryFn: ({signal}) => getFeideConnection({signal}),
    staleTime: ONE_MINUTE_MS,
    gcTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
  });
};
