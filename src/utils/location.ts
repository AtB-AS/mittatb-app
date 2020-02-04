import haversine, {Options} from 'haversine';
import {Location} from '../AppContext';

const options: Options = {unit: 'meter'};

type SortedLocation = {
  location: Location;
  distance: number;
};

export function sortNearestLocations(
  current: Location,
  ...rest: Location[]
): SortedLocation[] {
  return rest
    .map(location => ({
      location,
      distance: haversine(current.coordinates, location.coordinates, options),
    }))
    .sort((a, b) => a.distance - b.distance);
}
