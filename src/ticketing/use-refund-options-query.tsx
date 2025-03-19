import {useQuery} from '@tanstack/react-query';
import {getRefundOptions} from './api';

export const useRefundOptionsQuery = (orderId: string) => {
  return useQuery({
    queryKey: ['getRefundOptions', orderId],
    queryFn: () => getRefundOptions(orderId),
  });
};
