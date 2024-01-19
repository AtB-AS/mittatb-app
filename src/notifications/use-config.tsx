import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getConfig, NotificationConfigUpdate, updateConfig} from './api';

export const useConfig = () => {
  const queryClient = useQueryClient();

  const queryKey = ['notification/config'];
  const query = useQuery({
    queryKey,
    queryFn: getConfig,
  });
  const mutation = useMutation({
    mutationFn: (update: NotificationConfigUpdate) => updateConfig(update),
    onSuccess: () => queryClient.invalidateQueries(queryKey),
  });

  return {query, mutation};
};
