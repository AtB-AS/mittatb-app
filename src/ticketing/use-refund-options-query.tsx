import {useQuery} from '@tanstack/react-query';
import {getRefundOptions} from './api';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {FareContractState} from '@atb-as/utils';

export const useRefundOptionsQuery = (
  orderId: string,
  state: FareContractState,
) => {
  const {isRefundsEnabled} = useFeatureTogglesContext();
  return useQuery({
    queryKey: ['getRefundOptions', orderId, state],
    queryFn: () => getRefundOptions(orderId),
    enabled: isRefundsEnabled && !!orderId,
  });
};
