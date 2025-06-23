import {useMutation, useQueryClient} from '@tanstack/react-query';
import {addVehicleRegistration} from '../api/api';
import {useAuthContext} from '@atb/modules/auth';
import {getListVehicleRegistrationsQueryKey} from './use-list-vehicle-registrations-query';

export const useAddVehicleRegistration = (
  licensePlate: string,
  onSuccess: () => void,
) => {
  const {userId} = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['addSmartParkAndRideVehicle', userId, licensePlate],
    mutationFn: () => addVehicleRegistration(licensePlate),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries(
        getListVehicleRegistrationsQueryKey(userId),
      );
    },
  });
};
