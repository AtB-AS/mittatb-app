import {useMutation} from '@tanstack/react-query';
import {initAgeVerification} from '@atb/api/identity';

export const useInitAgeVerificationMutation = () => {
  return useMutation({
    mutationFn: () => initAgeVerification(),
  });
};
