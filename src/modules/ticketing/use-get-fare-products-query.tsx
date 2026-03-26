import {getFareProducts} from '@atb/modules/ticketing';
import {useQuery} from '@tanstack/react-query';
import {useAuthContext} from '@atb/modules/auth';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {ONE_HOUR_MS, ONE_WEEK_MS} from '@atb/utils/durations';

export const useGetFareProductsQuery = () => {
  const {userId, authStatus} = useAuthContext();
  const {isProductApiV2Enabled} = useFeatureTogglesContext();
  return useQuery({
    initialData: [],
    initialDataUpdatedAt: 0,
    queryKey: ['getProducts', userId, isProductApiV2Enabled],
    queryFn: () => getFareProducts(isProductApiV2Enabled),
    gcTime: ONE_WEEK_MS,
    staleTime: ONE_HOUR_MS,
    enabled: authStatus === 'authenticated',
    meta: {
      persistInAsyncStorage: true,
    },
  });
};
