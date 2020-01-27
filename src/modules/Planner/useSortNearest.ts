import haversine, {Options} from 'haversine';
import {Location} from '../../appContext';

const options: Options = {unit: 'meter'};

function isNotNull<T>(it: T): it is NonNullable<T> {
  return it != null;
}

type SortedLocation = {
  location: Location;
  distance: number;
};

export default function useSortNearest(
  current: Location | undefined,
  ...rest: (Location | undefined)[]
): null | SortedLocation[] {
  if (!current) return null;
  return rest
    .filter(isNotNull)
    .map(location => ({
      location,
      distance: haversine(current.coordinates, location.coordinates, options),
    }))
    .sort((a, b) => a.distance - b.distance);
}
