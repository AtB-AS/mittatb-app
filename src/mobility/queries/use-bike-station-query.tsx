import {useQuery} from '@tanstack/react-query';
import {getBikeStation} from '@atb/api/mobility';

const ONE_MINUTE = 1000 * 60;
export const useBikeStationQuery = (id: string) =>
  useQuery({
    queryKey: ['getBikeStation', id],
    queryFn: ({signal}) => getBikeStation(id, {signal}),
    staleTime: ONE_MINUTE,
    cacheTime: ONE_MINUTE,
  });
