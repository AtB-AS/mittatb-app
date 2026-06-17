import {connectFeide} from '@atb/api/identity';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {feideConnectionQueryKey} from './use-get-feide-connection-query';

export const useConnectFeideMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (authorizationCode: string) => connectFeide(authorizationCode),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [feideConnectionQueryKey]});
    },
  });
};
