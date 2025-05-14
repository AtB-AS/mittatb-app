import {FareZone} from '@atb/modules/configuration';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {useMemo} from 'react';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';

export const useFareZoneFromLocation = (fareZones: FareZone[]) => {
  const {location} = useGeolocationContext();
  return useMemo(() => {
    if (location) {
      const {longitude, latitude} = location.coordinates;
      return fareZones.find((t) =>
        turfBooleanPointInPolygon([longitude, latitude], t.geometry),
      );
    }
  }, [fareZones, location]);
};
