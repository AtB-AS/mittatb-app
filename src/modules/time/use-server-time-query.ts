import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getServerTime} from '@atb/api/identity';

export const useServerTimeQuery = (enabled: boolean) =>
  useQuery({
    queryKey: ['getServerTime'],
    queryFn: () => getServerTime(),
    refetchInterval: ONE_MINUTE_MS,
    refetchOnReconnect: true,
    refetchOnWindowFocus: 'always',
    enabled,
  });
