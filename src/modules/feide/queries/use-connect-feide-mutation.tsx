import {connectFeide} from '@atb/api/identity';
import {useMutation} from '@tanstack/react-query';

export const useConnectFeideMutation = () => {
  return useMutation({
    mutationFn: (authorizationCode: string) => connectFeide(authorizationCode),
  });
};
