import {useMutation} from '@tanstack/react-query';
import {authorizeUserAge} from '@atb/api/vipps-login/api';

export const useAuthorizeUserAgeMutation = () => {
  return useMutation({
    mutationFn: () => authorizeUserAge(),
  });
};
