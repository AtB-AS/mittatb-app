import {useMutation} from '@tanstack/react-query';
import {refundFareContract} from '@atb/modules/ticketing';
import Bugsnag from '@bugsnag/react-native';
import {ErrorResponse} from '@atb-as/utils';

export const useRefundFareContractMutation = () => {
  return useMutation({
    mutationFn: (orderId: string) => refundFareContract(orderId),
    onError: (error: ErrorResponse) => {
      Bugsnag.notify({
        name: `${error.http.code} error when refunding fare contract`,
        message: `Error: ${JSON.stringify(error)}`,
      });
    },
  });
};
