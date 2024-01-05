import {useQuery} from '@tanstack/react-query';
import {PreassignedFareProductId} from '@atb/configuration/types';
import {getFareProductBenefits} from '@atb/mobility/api/api';

const ONE_HOUR = 1000 * 60 * 60;

export const useFareProductBenefitsQuery = (
  productId: PreassignedFareProductId | undefined,
) =>
  useQuery({
    queryKey: ['fare-product-benefits', {productId}],
    queryFn: () => (productId ? getFareProductBenefits(productId) : []),
    staleTime: ONE_HOUR,
    cacheTime: ONE_HOUR,
  });
