import {useQuery} from '@tanstack/react-query';
import {getProfile} from '@atb/api';

export const getProfileQueryKey = 'getProfile';
export const useProfileQuery = () => {
  return useQuery({
    queryKey: [getProfileQueryKey],
    queryFn: getProfile,
  });
};
