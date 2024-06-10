import {useQuery} from '@tanstack/react-query';
import {getGeofencingZones} from '@atb/api/mobility';
import {useGeofencingZonesEnabled} from '../use-geofencing-zones-enabled';

const ONE_MINUTE = 1000 * 60;

export const useGeofencingZonesQuery = (systemIds: string[]) => {
  const [geofencingZonesEnabled, geofencingZonesEnabledDebugOverrideReady] =
    useGeofencingZonesEnabled();
  return useQuery({
    enabled:
      systemIds.length > 0 &&
      geofencingZonesEnabled &&
      geofencingZonesEnabledDebugOverrideReady,
    queryKey: ['getGeofencingZones', ...systemIds],
    queryFn: ({signal}) => getGeofencingZones(systemIds, {signal}),
    staleTime: ONE_MINUTE,
    cacheTime: ONE_MINUTE,
  });
};
