import {useMutation} from '@tanstack/react-query';
import {CustomerProfileUpdate} from '@atb/api/types/profile';
import {updateProfile} from '@atb/api';

export const useProfileUpdateMutation = () => {
  return useMutation({
    mutationKey: ['patchProfile'],
    mutationFn: (profile: CustomerProfileUpdate) => {
      return updateProfile(profile);
    },
  });
};
