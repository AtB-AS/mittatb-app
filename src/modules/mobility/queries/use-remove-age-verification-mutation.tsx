import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteAgeVerification} from '@atb/api/identity';

export const useDeleteAgeVerificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAgeVerification(),

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getAgeVerification']});
    },
  });
};
