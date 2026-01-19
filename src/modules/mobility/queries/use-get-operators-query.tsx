import {useQuery} from '@tanstack/react-query';
import {getOperatorsEntur} from '@atb/api/mobility';

export const useGetOperatorsQuery = () => {
  return useQuery({
    queryKey: ['GET_OPERATORS'],
    queryFn: getOperatorsEntur,
    retry: 2,
    staleTime: 60 * 60 * 6 * 1000, // 6 hours
    gcTime: 60 * 60 * 6 * 1000, // 6 hours
  });
};
