import {useQuery} from '@tanstack/react-query';
import {PreassignedFareProduct} from '@atb/configuration/types';
import {getFareProductBenefits} from '@atb/mobility/api/api';
import {useAuthState} from '@atb/auth';
import {ONE_HOUR_MS} from '@atb/utils/durations.ts';

export const useFareProductBenefitsQuery = (
  productId: PreassignedFareProduct['id'] | undefined,
) => {
  const {userId, authStatus} = useAuthState();
  return useQuery({
    queryKey: ['fare-product-benefits', userId, productId],
    queryFn: () => (productId ? getFareProductBenefits(productId) : []),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
    enabled: authStatus === 'authenticated',
  });
};
