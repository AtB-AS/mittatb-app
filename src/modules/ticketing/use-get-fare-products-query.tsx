import {getFareProducts} from '@atb/modules/ticketing';
import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {ONE_HOUR_MS, ONE_WEEK_MS} from '@atb/utils/durations';

export const useGetFareProductsQuery = () => {
  const {userId, authStatus} = useAuthContext();
  return useQuery({
    initialData: [],
    initialDataUpdatedAt: 0,
    queryKey: ['getProducts', userId],
    queryFn: getFareProducts,
    cacheTime: ONE_WEEK_MS,
    staleTime: ONE_HOUR_MS,
    enabled: authStatus === 'authenticated',
    meta: {
      persistInAsyncStorage: true,
    },
  });
};
