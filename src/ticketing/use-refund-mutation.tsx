import {useMutation} from '@tanstack/react-query';
import {refundFareContract} from '@atb/ticketing';

export const useRefundFareContractMutation = () => {
  return useMutation({
    mutationFn: (fareContractId: string) => refundFareContract(fareContractId),
  });
};
