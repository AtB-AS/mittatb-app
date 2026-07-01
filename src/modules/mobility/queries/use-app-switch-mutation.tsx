import {useMutation} from '@tanstack/react-query';
import {getAppSwitchUrl} from '@atb/api/mobility';
import {useAuthContext} from '@atb/modules/auth';
import {ErrorResponse} from '@atb-as/utils';

type AppSwitchVariables = {
  vehicleTypeId: string;
  bonusProductId?: string;
};

export const useAppSwitchMutation = () => {
  const {userId} = useAuthContext();
  return useMutation<{url: string}, ErrorResponse, AppSwitchVariables>({
    mutationKey: ['appSwitchUrl', userId],
    mutationFn: ({vehicleTypeId, bonusProductId}: AppSwitchVariables) =>
      getAppSwitchUrl(vehicleTypeId, bonusProductId),
  });
};
