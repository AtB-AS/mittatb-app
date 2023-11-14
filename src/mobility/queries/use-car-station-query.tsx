import {useQuery} from '@tanstack/react-query';
import {getCarStation} from '@atb/api/mobility';

const ONE_MINUTE = 1000 * 60;

export const useCarStationQuery = (id: string) =>
  useQuery({
    queryKey: ['getCarStation', id],
    queryFn: ({signal}) => getCarStation(id, {signal}),
    staleTime: ONE_MINUTE,
    cacheTime: ONE_MINUTE,
  });
