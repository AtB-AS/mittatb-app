import {registerForPushNotifications} from '@atb/push-notifications/api';
import {useMutation} from '@tanstack/react-query';

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: registerForPushNotifications,
  });
  return {mutation};
};
