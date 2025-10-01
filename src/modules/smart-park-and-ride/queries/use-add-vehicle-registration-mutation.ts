import {useMutation, useQueryClient} from '@tanstack/react-query';
import {addVehicleRegistration} from '../api/api';
import {useAuthContext} from '@atb/modules/auth';
import {getVehicleRegistrationsQueryKey} from './use-get-vehicle-registrations-query';
import {ErrorResponse} from '@atb-as/utils';

export const useAddVehicleRegistrationMutation = (
  licensePlate: string,
  nickname: string,
  onSuccess: () => void,
) => {
  const {userId} = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation<void, ErrorResponse>({
    mutationKey: ['addVehicleRegistration', userId, licensePlate, nickname],
    mutationFn: () => addVehicleRegistration(licensePlate, nickname),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: [getVehicleRegistrationsQueryKey(userId)],
      });
    },
  });
};
