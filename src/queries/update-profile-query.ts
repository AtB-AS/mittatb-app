import {useMutation, useQueryClient} from '@tanstack/react-query';
import {CustomerProfileUpdate} from '@atb/api/types/profile';
import {updateProfile} from '@atb/api';
import {getProfileQueryKey} from '@atb/queries/get-profile-query';

export const useProfileUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['patchProfile'],
    mutationFn: (profile: CustomerProfileUpdate) => {
      return updateProfile(profile);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({queryKey: [getProfileQueryKey]});
    },
  });
};
