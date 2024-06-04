import {useQuery} from '@tanstack/react-query';
import {getProfile} from '@atb/api';
import {useAuthState} from '@atb/auth';

export const getProfileQueryKey = 'getProfile';
export const useProfileQuery = () => {
  const {userId, authStatus} = useAuthState();
  return useQuery({
    queryKey: [getProfileQueryKey, userId],
    queryFn: getProfile,
    enabled: authStatus === 'authenticated',
  });
};
