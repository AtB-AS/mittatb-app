import {useQuery} from '@tanstack/react-query';
import {getStation} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';

export const getStationQueryKey = (id: string) => ['getStation', id];

export const useStationQuery = (id: string) =>
  useQuery({
    queryKey: getStationQueryKey(id),
    queryFn: ({signal}) => getStation(id, {signal}),
    staleTime: ONE_MINUTE_MS,
    gcTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 5,
  });
