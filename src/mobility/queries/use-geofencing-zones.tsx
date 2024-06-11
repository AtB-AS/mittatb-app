import {useQuery} from '@tanstack/react-query';
import {getGeofencingZones} from '@atb/api/mobility';
import {useGeofencingZonesEnabled} from '../use-geofencing-zones-enabled';

const TWELVE_HOURS_MS = 1000 * 60 * 60 * 12;

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
    staleTime: TWELVE_HOURS_MS,
    cacheTime: TWELVE_HOURS_MS,
  });
};
