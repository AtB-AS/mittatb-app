import {useQuery} from '@tanstack/react-query';
import {getGeofencingZones} from '@atb/api/mobility';
import {useGeofencingZonesEnabled} from '../use-geofencing-zones-enabled';

const TWELVE_HOURS_MS = 1000 * 60 * 60 * 12;

export const useGeofencingZonesQuery = (systemId?: string) => {
  const [geofencingZonesEnabled, geofencingZonesEnabledDebugOverrideReady] =
    useGeofencingZonesEnabled();
  return useQuery({
    enabled:
      systemId !== undefined &&
      geofencingZonesEnabled &&
      geofencingZonesEnabledDebugOverrideReady,
    queryKey: ['getGeofencingZones', systemId],
    queryFn: ({signal}) =>
      getGeofencingZones(systemId !== undefined ? [systemId] : [], {signal}),
    staleTime: TWELVE_HOURS_MS,
    cacheTime: TWELVE_HOURS_MS,
  });
};
