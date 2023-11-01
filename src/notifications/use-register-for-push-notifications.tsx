import {useMutation} from '@tanstack/react-query';
import {registerForPushNotifications} from '@atb/notifications/api';

export const useRegisterForPushNotifications = () =>
  useMutation({
    mutationFn: registerForPushNotifications,
  });
