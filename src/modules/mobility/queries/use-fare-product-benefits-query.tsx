import {useQuery} from '@tanstack/react-query';
import {PreassignedFareProduct} from '@atb/modules/configuration';
import {useAuthContext} from '@atb/modules/auth';
import {ONE_HOUR_MS} from '@atb/utils/durations';
import {getFareProductBenefits} from '../api/api';

export const useFareProductBenefitsQuery = (
  productId: PreassignedFareProduct['id'] | undefined,
) => {
  const {userId, authStatus} = useAuthContext();
  return useQuery({
    queryKey: ['fare-product-benefits', userId, productId],
    queryFn: () => (productId ? getFareProductBenefits(productId) : []),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
    enabled: authStatus === 'authenticated',
  });
};
