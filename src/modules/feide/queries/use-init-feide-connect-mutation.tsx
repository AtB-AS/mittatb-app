import {initFeideConnect} from '@atb/api/identity';
import {useMutation} from '@tanstack/react-query';
import {openInAppBrowser} from '@atb/modules/in-app-browser';

export const useInitFeideConnectMutation = () => {
  return useMutation({
    mutationFn: () => initFeideConnect(),
    onSuccess: (url) => openInAppBrowser(url, 'cancel'),
  });
};
