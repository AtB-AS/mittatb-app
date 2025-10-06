import {useQuery} from '@tanstack/react-query';
import {getGeofencingZones} from '@atb/api/bff/mobility';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const useGeofencingZonesQuery = (systemId: string) => {
  return useQuery({
    queryKey: ['getGeofencingZones', systemId],
    queryFn: ({signal}) => getGeofencingZones([systemId], {signal}),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
  });
};
