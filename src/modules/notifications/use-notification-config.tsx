import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  getNotificationConfig,
  NotificationConfigUpdate,
  updateNotificationConfig,
} from './api';
import {useAuthContext} from '@atb/modules/auth';

const QUERY_PARENT_KEY = 'notification/config';

export const useNotificationConfig = () => {
  const queryClient = useQueryClient();
  const {authStatus, userId} = useAuthContext();

  const query = useQuery({
    queryKey: [QUERY_PARENT_KEY, userId],
    queryFn: getNotificationConfig,
    enabled: authStatus === 'authenticated',
  });
  const mutation = useMutation({
    mutationFn: (update: NotificationConfigUpdate) =>
      updateNotificationConfig(update),
    onSuccess: () => queryClient.invalidateQueries([QUERY_PARENT_KEY]),
  });

  return {query, mutation};
};
