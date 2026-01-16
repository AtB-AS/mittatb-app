import {useMutation} from '@tanstack/react-query';
import {activateFareContractNow} from '@atb/modules/ticketing';
import Bugsnag from '@bugsnag/react-native';
import {RequestError} from '@atb/api/utils';

export const useActivateFareContractNowMutation = () => {
  return useMutation({
    mutationFn: (fareContractId: string) =>
      activateFareContractNow(fareContractId),
    onError: (error: RequestError) => {
      const httpCode = error.http?.code ?? 'UNKNOWN';
      Bugsnag.notify({
        name: `${httpCode} error when activating fare contract ahead of time`,
        message: `Error: ${JSON.stringify(error)}`,
      });
    },
  });
};
