import {Location} from '@atb/modules/favorites';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {Polygon} from 'geojson';
import {useMemo} from 'react';

type Zone = {geometry: Polygon};

export const useFindZoneInLocation = <T extends Zone>(
  location: Location | undefined,
  zones?: T[],
) => {
  return useMemo(() => {
    if (location?.coordinates.latitude && zones) {
      return zones.find(({geometry}) =>
        turfBooleanPointInPolygon(
          [location?.coordinates.longitude, location?.coordinates.latitude],
          geometry,
        ),
      );
    }
  }, [zones, location?.coordinates.longitude, location?.coordinates.latitude]);
};
