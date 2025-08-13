import {useQuery} from '@tanstack/react-query';
import {getBirthdate} from '@atb/api/identity';

export const useGetBirthdateQuery = () => {
  return useQuery({
    queryKey: ['getBirthdate'],
    queryFn: getBirthdate,
    retry: 2,
  });
};
