import {useMutation, useQueryClient} from '@tanstack/react-query';
import {editVehicleRegistration} from '../api/api';
import {useAuthContext} from '@atb/modules/auth';
import {getVehicleRegistrationsQueryKey} from './use-get-vehicle-registrations-query';

export const useEditVehicleRegistrationMutation = (
  id: string,
  licensePlate: string,
  onSuccess: () => void,
) => {
  const {userId} = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['editVehicleRegistration', userId, licensePlate],
    mutationFn: () => editVehicleRegistration(id, licensePlate),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries(getVehicleRegistrationsQueryKey(userId));
    },
  });
};
