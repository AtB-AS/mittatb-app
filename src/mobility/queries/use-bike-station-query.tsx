import {useQuery} from '@tanstack/react-query';
import {getBikeStation} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';

export const useBikeStationQuery = (id: string) =>
  useQuery({
    queryKey: ['getBikeStation', id],
    queryFn: ({signal}) => getBikeStation(id, {signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
  });
