import {useQuery} from '@tanstack/react-query';
import {getOperators} from '@atb/api/mobility';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const useGetOperatorsQuery = () => {
  return useQuery({
    queryKey: ['GET_OPERATORS'],
    queryFn: getOperators,
    retry: 2,
    staleTime: ONE_HOUR_MS * 6,
    gcTime: ONE_HOUR_MS * 6,
    meta: {
      persistInAsyncStorage: true,
    },
  });
};
