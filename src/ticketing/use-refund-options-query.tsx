import {useQuery} from '@tanstack/react-query';
import {getRefundOptions} from './api';

export const useRefundOptionsQuery = (fareContractId: string) => {
  return useQuery({
    queryKey: ['getRefundOptions', fareContractId],
    queryFn: () => getRefundOptions(fareContractId),
    refetchInterval: 20000,
  });
};
