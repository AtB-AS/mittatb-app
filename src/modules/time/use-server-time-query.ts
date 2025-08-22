import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getServerTime} from '@atb/api/identity';
import {useFeatureTogglesContext} from '../feature-toggles';

export const useServerTimeQuery = () => {
  const {isServerTimeEnabled} = useFeatureTogglesContext();

  return useQuery({
    queryKey: ['getServerTime'],
    queryFn: () => getServerTime(),
    refetchInterval: ONE_MINUTE_MS,
    refetchOnReconnect: true,
    refetchOnWindowFocus: 'always',
    enabled: isServerTimeEnabled,
  });
};
