import {useFirestoreConfiguration} from '@atb/configuration';
import {getFareProducts} from '@atb/ticketing';
import {useQuery} from '@tanstack/react-query';
import {useAuthState} from '@atb/auth';
import {ONE_HOUR_MS} from '@atb/utils/durations.ts';

export const useGetFareProductsQuery = () => {
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const {userId, authStatus} = useAuthState();
  return useQuery({
    initialData: preassignedFareProducts,
    queryKey: ['getProducts', userId],
    queryFn: getFareProducts,
    cacheTime: ONE_HOUR_MS,
    enabled: authStatus === 'authenticated',
  });
};
