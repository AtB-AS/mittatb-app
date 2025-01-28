import {useQuery} from '@tanstack/react-query';
import {getProfile} from '@atb/api';
import {useAuthContext} from '@atb/auth';
import {CustomerProfile} from '@atb/api/types/profile';
import {useEffect} from 'react';

export const getProfileQueryKey = 'getProfile';
export const useProfileQuery = (
  onSuccessCallback?: (data: CustomerProfile) => void,
) => {
  const {userId, authStatus} = useAuthContext();
  const res = useQuery({
    queryKey: [getProfileQueryKey, userId],
    queryFn: getProfile,
    enabled: authStatus === 'authenticated',
  });

  useEffect(() => {
    if (res.status === 'success' && onSuccessCallback) {
      onSuccessCallback(res.data);
    }
  }, [res.status, res.data, onSuccessCallback]);

  return res;
};
