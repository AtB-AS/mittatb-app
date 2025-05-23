import {Location} from '@atb/modules/favorites';
import {CityZone} from '@atb/modules/configuration';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {useMemo} from 'react';




export const useFindCityZoneInLocation = (
  location: Location | undefined,
  cityZones?: CityZone[],
) => {
  return useMemo(() => {
    if (location?.coordinates.latitude && cityZones) {
      return cityZones.find(({geometry}) =>
        turfBooleanPointInPolygon(
          [location?.coordinates.longitude, location?.coordinates.latitude],
          geometry,
        ),
      );
    }
  }, [
    cityZones,
    location?.coordinates.longitude,
    location?.coordinates.latitude,
  ]);
};
