import {getFareProducts} from '@atb/ticketing';
import {useQuery} from '@tanstack/react-query';

const ONE_HOUR_MS = 1000 * 60 * 60;

export const useGetFareProductsQuery = () => {
  return useQuery({
    queryKey: ['getProducts'],
    queryFn: getFareProducts,
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
};
