import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getConfig, NotificationConfigUpdate, updateConfig} from './api';
import {useAuthState} from '@atb/auth';

export const useConfig = () => {
  const queryClient = useQueryClient();
  const {userId} = useAuthState();

  const queryKey = ['notification/config', userId];
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
