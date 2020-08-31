import haversine from 'haversine-distance';
import {Location} from '../favorites/types';

type SortedLocation = {
  location: Location;
  distance: number;
};
export const LOCATIONS_REALLY_CLOSE_THRESHOLD = 200;

export function sortNearestLocations(
  current: Location,
  ...rest: Location[]
): SortedLocation[] {
  return rest
    .map((location) => ({
      location,
      distance: haversine(current.coordinates, location.coordinates),
    }))
    .sort((a, b) => a.distance - b.distance);
}
export function locationsAreEqual(l1: Location, l2: Location) {
  return (
    l1.coordinates.latitude === l2.coordinates.latitude &&
    l1.coordinates.longitude === l2.coordinates.longitude
  );
}
export function locationDistanceInMetres(l1: Location, l2: Location) {
  return haversine(l1.coordinates, l2.coordinates);
}
