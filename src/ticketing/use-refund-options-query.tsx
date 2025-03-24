import {useQuery} from '@tanstack/react-query';
import {getRefundOptions} from './api';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const useRefundOptionsQuery = (orderId: string) => {
  const {isRefundsEnabled} = useFeatureTogglesContext();
  return useQuery({
    queryKey: ['getRefundOptions', orderId],
    queryFn: () => getRefundOptions(orderId),
    enabled: isRefundsEnabled,
  });
};
