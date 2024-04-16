import {useQuery} from '@tanstack/react-query';
import {getVehicle} from '@atb/api/mobility';

const ONE_MINUTE = 1000 * 60;
export const useVehicleQuery = (id?: string) =>
  useQuery({
    enabled: !!id,
    queryKey: ['getVehicle', id],
    queryFn: ({signal}) => getVehicle(id, {signal}),
    staleTime: ONE_MINUTE,
    cacheTime: ONE_MINUTE,
  });
