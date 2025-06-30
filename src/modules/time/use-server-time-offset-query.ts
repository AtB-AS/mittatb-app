import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getServerTimeOffset} from '@atb/api/identity';
import {useFeatureTogglesContext} from '../feature-toggles';

export const useServerTimeOffsetQuery = () => {
  const {isServerTimeEnabled} = useFeatureTogglesContext();
  return useQuery({
    queryKey: ['getTime'],
    queryFn: () => getServerTimeOffset(),
    enabled: isServerTimeEnabled,
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
    refetchInterval: ONE_MINUTE_MS,
  });
};
