import {PolygonGeometry} from '@atb-as/config-specs';
import {toGeoJSON} from '@mapbox/polyline';

export const decodePolylineEncodedGeometry = (geometry: PolygonGeometry) => {
  const coordinates = geometry.polylineEncodedCoordinates?.map(
    (polylineEncodedRing) => {
      const polygon = toGeoJSON(polylineEncodedRing);
      return polygon.coordinates;
    },
  );
  return {type: geometry.type, coordinates};
};
