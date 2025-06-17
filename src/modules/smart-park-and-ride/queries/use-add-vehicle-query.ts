import {useMutation} from '@tanstack/react-query';
import {addVehicle} from '../api/api';
import {useAuthContext} from '@atb/modules/auth';

export const useAddVehicle = (licensePlate: string, onSuccess: () => void) => {
  const {userId} = useAuthContext();

  return useMutation({
    mutationKey: ['addSmartParkAndRideVehicle', userId, licensePlate],
    mutationFn: () => addVehicle(licensePlate),
    onSuccess,
  });
};
