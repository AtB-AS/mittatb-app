import {useFirestoreConfiguration} from '@atb/configuration';
import {getFareProducts} from '@atb/ticketing';
import {useQuery} from '@tanstack/react-query';
import {useAuthState} from '@atb/auth';

const ONE_HOUR_MS = 1000 * 60 * 60;

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
