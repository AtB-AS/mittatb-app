import {useQuery} from '@tanstack/react-query';
import {getProfile} from '@atb/api';
import {useAuthContext} from '@atb/auth';

export const getProfileQueryKey = 'getProfile';
export const useProfileQuery = () => {
  const {userId, authStatus} = useAuthContext();
  return useQuery({
    queryKey: [getProfileQueryKey, userId],
    queryFn: getProfile,
    enabled: authStatus === 'authenticated',
  });
};
