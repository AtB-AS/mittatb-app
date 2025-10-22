import {useMutation, useQueryClient} from '@tanstack/react-query';
import {CustomerProfileUpdate} from '@atb/api/types/profile';
import {updateProfile} from '@atb/api';
import {getProfileQueryKey} from '@atb/queries/get-profile-query';
import {ErrorResponse} from '@atb-as/utils';

export const useProfileUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ErrorResponse, CustomerProfileUpdate>({
    mutationKey: ['patchProfile'],
    mutationFn: (profile: CustomerProfileUpdate) => updateProfile(profile),
    onSuccess: () =>
      queryClient.invalidateQueries({queryKey: [getProfileQueryKey]}),
  });
};
