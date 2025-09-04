import {useMutation, useQueryClient} from '@tanstack/react-query';
import {editVehicleRegistration} from '../api/api';
import {useAuthContext} from '@atb/modules/auth';
import {getVehicleRegistrationsQueryKey} from './use-get-vehicle-registrations-query';
import {ErrorResponse} from '@atb-as/utils';

export const useEditVehicleRegistrationMutation = (
  id: string,
  licensePlate: string,
  nickname: string,
  onSuccess: () => void,
) => {
  const {userId} = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation<void, ErrorResponse>({
    mutationKey: ['editVehicleRegistration', userId, licensePlate, nickname],
    mutationFn: () => editVehicleRegistration(id, licensePlate, nickname),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries(getVehicleRegistrationsQueryKey(userId));
    },
  });
};
