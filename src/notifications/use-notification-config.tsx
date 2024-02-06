import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  getNotificationConfig,
  NotificationConfigUpdate,
  updateNotificationConfig,
} from './api';

export const useNotificationConfig = () => {
  const queryClient = useQueryClient();

  const queryKey = ['notification/config'];
  const query = useQuery({
    queryKey,
    queryFn: getNotificationConfig,
  });
  const mutation = useMutation({
    mutationFn: (update: NotificationConfigUpdate) =>
      updateNotificationConfig(update),
    onSuccess: () => queryClient.invalidateQueries(queryKey),
  });

  return {query, mutation};
};
