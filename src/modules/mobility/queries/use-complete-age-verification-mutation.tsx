import {completeAgeVerification} from '@atb/api/vipps-login/api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {getAgeVerificationQueryKey} from './use-get-age-verification-query';

export const useCompleteAgeVerificationMutation = (legalAge: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (authorizationCode: string) =>
      completeAgeVerification(authorizationCode),

    onSuccess: () => {
      queryClient.invalidateQueries(getAgeVerificationQueryKey(legalAge));
    },
  });
};
