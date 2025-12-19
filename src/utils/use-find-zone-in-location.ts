import {PolygonGeometry} from '@atb-as/config-specs';
import {Location} from '@atb/modules/favorites';
import {decodePolylineEncodedGeometry} from '@atb/modules/map/geofencing-zone-utils';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {Polygon} from 'geojson';
import {useMemo} from 'react';

type Zone = {geometry: PolygonGeometry};

export const useFindZoneInLocation = <T extends Zone>(
  location: Location | undefined,
  zones?: T[],
) => {
  return useMemo(() => {
    if (location && zones) {
      return findZoneInLocation(location, zones);
    }
  }, [zones, location]);
};

export const findZoneInLocation = <T extends Zone>(
  location: Location | undefined,
  zones?: T[],
) => {
  if (
    !location?.coordinates.longitude ||
    !location?.coordinates.latitude ||
    !zones
  ) {
    return undefined;
  }
  return zones.find(({geometry}) =>
    turfBooleanPointInPolygon<Polygon>(
      [location.coordinates.longitude, location.coordinates.latitude],
      decodePolylineEncodedGeometry(geometry),
    ),
  );
};
