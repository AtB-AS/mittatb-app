import {initFeideConnect} from '@atb/api/identity';
import {useMutation} from '@tanstack/react-query';

export const useInitFeideConnectMutation = () => {
  return useMutation({
    mutationFn: () => initFeideConnect(),
  });
};
