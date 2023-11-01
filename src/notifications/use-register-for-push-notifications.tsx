import {useQuery} from '@tanstack/react-query';
import {registerForPushNotifications} from '@atb/notifications/api';

const ONE_DAY = 1000 * 60 * 60 * 24;
export const useRegisterForPushNotifications = (token?: string) =>
  useQuery({
    queryKey: ['notification/register', {token}],
    queryFn: () => registerForPushNotifications(token!),
    enabled: Boolean(token),
    staleTime: ONE_DAY,
    cacheTime: ONE_DAY,
  });
