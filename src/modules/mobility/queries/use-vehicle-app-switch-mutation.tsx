import {useMutation} from '@tanstack/react-query';
import {getVehicleAppSwitch} from '@atb/api/mobility';
import {useAuthContext} from '@atb/modules/auth';
import {ErrorResponse} from '@atb-as/utils';

type VehicleAppSwitchVariables = {
  vehicleId: string;
  bonusProductId?: string;
};

export const useVehicleAppSwitchMutation = () => {
  const {userId} = useAuthContext();
  return useMutation<{url: string}, ErrorResponse, VehicleAppSwitchVariables>({
    mutationKey: ['GET_VEHICLE_APP_SWITCH', userId],
    mutationFn: ({vehicleId, bonusProductId}: VehicleAppSwitchVariables) =>
      getVehicleAppSwitch(vehicleId, bonusProductId),
  });
};
