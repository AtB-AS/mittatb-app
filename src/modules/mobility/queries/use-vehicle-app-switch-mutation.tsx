import {useMutation} from '@tanstack/react-query';
import {getVehicleAppSwitch} from '@atb/api/mobility';
import {useAuthContext} from '@atb/modules/auth';

export type VehicleAppSwitchVariables = {
  vehicleId?: string;
  vehicleTypeId?: string;
  stationId?: string;
  bonusProductId?: string;
};

export const useVehicleAppSwitchMutation = () => {
  const {userId} = useAuthContext();
  return useMutation({
    mutationKey: ['GET_VEHICLE_APP_SWITCH', userId],
    mutationFn: ({
      vehicleId,
      vehicleTypeId,
      stationId,
      bonusProductId,
    }: VehicleAppSwitchVariables) =>
      getVehicleAppSwitch(vehicleId, vehicleTypeId, stationId, bonusProductId),
  });
};
