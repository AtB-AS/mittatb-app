import {useQuery} from '@tanstack/react-query';
import {getProfile} from '@atb/api';
import {useAuthContext} from '@atb/auth';
import {CustomerProfile} from '@atb/api/types/profile';

export const getProfileQueryKey = 'getProfile';
export const useProfileQuery = (
  onSuccessCallback?: (data: CustomerProfile) => void,
) => {
  const {userId, authStatus} = useAuthContext();
  return useQuery({
    queryKey: [getProfileQueryKey, userId],
    queryFn: getProfile,
    enabled: authStatus === 'authenticated',
    onSuccess: onSuccessCallback,
  });
};
