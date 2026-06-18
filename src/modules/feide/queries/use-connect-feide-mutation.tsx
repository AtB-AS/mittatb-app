import {connectFeide, ConnectFeideParams} from '@atb/api/identity';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {feideConnectionQueryKey} from './use-get-feide-connection-query';

export const useConnectFeideMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: ConnectFeideParams) => connectFeide(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [feideConnectionQueryKey]});
    },
  });
};
