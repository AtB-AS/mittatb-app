import {useQuery} from '@tanstack/react-query';
import {getStation} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';

export const useStationQuery = (id: string) =>
  useQuery({
    queryKey: ['getStation', id],
    queryFn: ({signal}) => getStation(id, {signal}),
    staleTime: ONE_MINUTE_MS,
    gcTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 5,
  });
