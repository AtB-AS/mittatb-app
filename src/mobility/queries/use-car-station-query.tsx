import {useQuery} from '@tanstack/react-query';
import {getCarStation} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations.ts';

export const useCarStationQuery = (id: string) =>
  useQuery({
    queryKey: ['getCarStation', id],
    queryFn: ({signal}) => getCarStation(id, {signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
  });
