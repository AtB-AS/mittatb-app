import {useMutation} from '@tanstack/react-query';
import {refundFareContract} from '@atb/modules/ticketing';
import Bugsnag from '@bugsnag/react-native';
import {RequestError} from '@atb/api/utils';

export const useRefundFareContractMutation = () => {
  return useMutation({
    mutationFn: (orderId: string) => refundFareContract(orderId),
    onError: (error: RequestError) => {
      const httpCode = error.http?.code ?? 'UNKNOWN';
      Bugsnag.notify({
        name: `${httpCode} error when refunding fare contract`,
        message: `Error: ${JSON.stringify(error)}`,
      });
    },
  });
};
