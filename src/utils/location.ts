import haversine from 'haversine-distance';
import {Location} from '../favorites/types';

type SortedLocation = {
  location: Location;
  distance: number;
};

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
