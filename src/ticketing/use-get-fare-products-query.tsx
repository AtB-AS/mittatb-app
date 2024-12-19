import {useFirestoreConfigurationContext} from '@atb/configuration';
import {getFareProducts} from '@atb/ticketing';
import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/auth';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const useGetFareProductsQuery = () => {
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const {userId, authStatus} = useAuthContext();
  return useQuery({
    initialData: preassignedFareProducts,
    initialDataUpdatedAt: 0,
    queryKey: ['getProducts', userId],
    queryFn: getFareProducts,
    cacheTime: ONE_HOUR_MS,
    staleTime: ONE_HOUR_MS,
    enabled: authStatus === 'authenticated',
  });
};
