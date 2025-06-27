import {useMutation, useQueryClient} from '@tanstack/react-query';
import {addVehicleRegistration} from '../api/api';
import {useAuthContext} from '@atb/modules/auth';
import {getVehicleRegistrationsQueryKey} from './use-get-vehicle-registrations-query';

export const useAddVehicleRegistrationMutation = (
  licensePlate: string,
  onSuccess: () => void,
) => {
  const {userId} = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['addVehicleRegistration', userId, licensePlate],
    mutationFn: () => addVehicleRegistration(licensePlate),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries(getVehicleRegistrationsQueryKey(userId));
    },
  });
};
