import {useQuery} from '@tanstack/react-query';
import {getGeofencingZones} from '@atb/api/mobility';
import {HALF_DAY_MS} from '@atb/utils/durations';

export const useGeofencingZonesQuery = (systemId: string) => {
  return useQuery({
    queryKey: ['getGeofencingZones', systemId],
    queryFn: ({signal}) => getGeofencingZones([systemId], {signal}),
    staleTime: HALF_DAY_MS,
    cacheTime: HALF_DAY_MS,
  });
};
