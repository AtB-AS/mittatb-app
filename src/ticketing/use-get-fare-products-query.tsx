import { useFirestoreConfiguration } from '@atb/configuration';
import {getFareProducts} from '@atb/ticketing';
import {useQuery} from '@tanstack/react-query';

const ONE_HOUR_MS = 1000 * 60 * 60;

export const useGetFareProductsQuery = () => {
  const {preassignedFareProducts} = useFirestoreConfiguration();
  return useQuery({
    initialData: preassignedFareProducts,
    queryKey: ['getProducts'],
    queryFn: getFareProducts,
    cacheTime: ONE_HOUR_MS,
  });
};
