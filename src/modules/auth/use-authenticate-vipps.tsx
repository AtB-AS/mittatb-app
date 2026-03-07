import {useMutation} from '@tanstack/react-query';
import {authorizeVippsUser} from '@atb/api/identity';

export function useAuthenticateVipps({
  onMutate,
  onError,
  onSettled,
  onSuccess,
}: {
  onMutate: () => void;
  onError: () => void;
  onSettled: () => void;
  onSuccess: (url: string) => void;
}) {
  return useMutation<string, Error>({
    mutationKey: ['authenticateVipps'],
    mutationFn: authorizeVippsUser,
    onMutate,
    onSuccess,
    onError,
    onSettled,
  });
}
