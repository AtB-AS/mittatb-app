import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getVehicle} from '@atb/api/mobility';

export const useVehicleQuery = (id?: string) =>
  useQuery({
    queryKey: ['getVehicle', id],
    queryFn: ({signal}) => getVehicle(id, {signal}),
    staleTime: ONE_MINUTE_MS,
    gcTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 5,
  });
