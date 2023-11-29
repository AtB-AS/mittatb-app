import {useQuery} from '@tanstack/react-query';
import {getProfile} from '@atb/api';

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['getProfile'],
    queryFn: getProfile,
  });
  // check if we need stale time
};
