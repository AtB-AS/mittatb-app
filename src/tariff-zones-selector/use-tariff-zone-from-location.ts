import {TariffZone} from '@atb/configuration';
import {useGeolocationContext} from '@atb/GeolocationContext';
import {useMemo} from 'react';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';

export const useTariffZoneFromLocation = (tariffZones: TariffZone[]) => {
  const {location} = useGeolocationContext();
  return useMemo(() => {
    if (location) {
      const {longitude, latitude} = location.coordinates;
      return tariffZones.find((t) =>
        turfBooleanPointInPolygon([longitude, latitude], t.geometry),
      );
    }
  }, [tariffZones, location]);
};
