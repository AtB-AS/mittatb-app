import {
  connectFeide,
  ConnectFeideParams,
  FeideConnectResponse,
} from '@atb/api/identity';
import {RequestError} from '@atb/api/utils';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {feideConnectionQueryKey} from './use-get-feide-connection-query';

export const useConnectFeideMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<FeideConnectResponse, RequestError, ConnectFeideParams>({
    mutationFn: (params: ConnectFeideParams) => connectFeide(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [feideConnectionQueryKey]});
    },
  });
};
