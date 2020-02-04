import {Location, UserLocations} from '../../../AppContext';
import {sortNearestLocations} from '../../../utils/location';

export default function useSortedLocations(
  currentLocation: Location | null,
  userLocations: UserLocations,
) {
  const sortedWorkHomeLocations = currentLocation
    ? sortNearestLocations(
        currentLocation,
        userLocations.home,
        userLocations.work,
      ).map(sl => sl.location)
    : [null, null];

  const [nearest, furthest] = sortedWorkHomeLocations;
  return {nearest, furthest};
}
