import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getConfig, NotificationConfigUpdate, updateConfig} from './api';

export const useConfig = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notification/config'],
    queryFn: getConfig,
  });
  const mutation = useMutation({
    mutationFn: (update: NotificationConfigUpdate) => updateConfig(update),
    onSuccess: () => queryClient.invalidateQueries(['notification/config']),
  });

  return {query, mutation};
};
