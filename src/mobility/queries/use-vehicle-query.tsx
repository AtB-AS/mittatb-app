import {useQuery} from '@tanstack/react-query';
import {getVehicle} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from "@atb/utils/durations.ts";

export const useVehicleQuery = (id: string) =>
  useQuery({
    queryKey: ['getVehicle', id],
    queryFn: ({signal}) => getVehicle(id, {signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
  });
