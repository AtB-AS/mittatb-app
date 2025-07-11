import {useQuery} from '@tanstack/react-query';
import {getCarStation} from '@atb/api/bff/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';

export const useCarStationQuery = (id: string) =>
  useQuery({
    queryKey: ['getCarStation', id],
    queryFn: ({signal}) => getCarStation(id, {signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 5,
  });
