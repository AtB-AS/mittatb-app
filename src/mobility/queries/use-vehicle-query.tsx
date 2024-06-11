import {useQuery} from '@tanstack/react-query';
import {getVehicle} from '@atb/api/mobility';

const ONE_MINUTE = 1000 * 60;
export const useVehicleQuery = (id?: string) =>
  useQuery({
    queryKey: ['getVehicle', id],
    queryFn: ({signal}) => (id ? getVehicle(id, {signal}) : undefined),
    staleTime: ONE_MINUTE,
    cacheTime: ONE_MINUTE,
  });
