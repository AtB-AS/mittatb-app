import {useMutation} from '@tanstack/react-query';
import {initAgeVerification} from '@atb/api/vipps-login/api';

export const useInitAgeVerificationMutation = () => {
  return useMutation({
    mutationFn: () => initAgeVerification(),
  });
};
