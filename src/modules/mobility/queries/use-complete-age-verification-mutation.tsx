import {completeAgeVerification} from '@atb/api/identity';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {ageVerificationQueryKeyString} from './use-get-age-verification-query';

export const useCompleteAgeVerificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (authorizationCode: string) =>
      completeAgeVerification(authorizationCode),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ageVerificationQueryKeyString],
      });
    },
  });
};
