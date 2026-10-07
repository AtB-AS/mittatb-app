import {Feature, Point} from 'geojson';
import {Location} from '@atb/modules/favorites';

export const locationToFeature = (
  location: Location,
): Feature<Point, Location> => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [
      location.coordinates.longitude,
      location.coordinates.latitude,
    ],
  },
  properties: location,
});
