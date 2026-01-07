import {PolygonGeometry} from '@atb-as/config-specs';
import {toGeoJSON} from '@mapbox/polyline';

export const decodePolylineEncodedGeometry = (geometry: PolygonGeometry) => {
  // Temporary fix for users who have old data without polylineEncodedCoordinates, only for version 1.78
  if (
    !geometry.polylineEncodedCoordinates ||
    geometry.polylineEncodedCoordinates.length === 0
  ) {
    return {type: geometry.type, coordinates: geometry.coordinates!};
  }

  const coordinates = geometry.polylineEncodedCoordinates?.map(
    (polylineEncodedRing) => {
      const polygon = toGeoJSON(polylineEncodedRing);
      return polygon.coordinates;
    },
  );
  return {type: geometry.type, coordinates};
};
