import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteVehicleRegistration} from '../api/api';
import {useAuthContext} from '@atb/modules/auth';
import {getVehicleRegistrationsQueryKey} from './use-get-vehicle-registrations-query';

export const useDeleteVehicleRegistrationMutation = (
  id: string,
  onSuccess: () => void,
) => {
  const {userId} = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteVehicleRegistration', userId, id],
    mutationFn: () => deleteVehicleRegistration(id),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries(getVehicleRegistrationsQueryKey(userId));
    },
  });
};
