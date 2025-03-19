import {useMutation} from '@tanstack/react-query';
import {refundFareContract} from '@atb/ticketing';
import {getAxiosErrorMetadata} from '@atb/api/utils';
import Bugsnag from '@bugsnag/react-native';

export const useRefundFareContractMutation = () => {
  return useMutation({
    mutationFn: (orderId: string) => refundFareContract(orderId),
    onError: (error: any) => {
      const errorData = getAxiosErrorMetadata(error);
      Bugsnag.notify({
        name: `${errorData.responseStatus} error when refunding fare contract`,
        message: `Error: ${JSON.stringify(errorData)}`,
      });
    },
  });
};
