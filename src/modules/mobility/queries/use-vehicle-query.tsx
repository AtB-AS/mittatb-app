import {useQuery} from '@tanstack/react-query';
import {getVehicle} from '@atb/api/bff/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';

export const useVehicleQuery = (id: string) =>
  useQuery({
    queryKey: ['getVehicle', id],
    queryFn: ({signal}) => getVehicle(id, {signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
    refetchOnMount: 'always',
    retry: 5,
  });
