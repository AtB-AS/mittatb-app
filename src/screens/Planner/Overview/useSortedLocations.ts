import {sortNearestLocations} from '../../../utils/location';
import {Location, UserFavorites} from '../../../favorites/types';

function getLegacyUserLocation(
  userLocations: UserFavorites | null,
  type: 'home' | 'work',
) {
  return userLocations?.find(i => i.name === type) ?? null;
}

export default function useSortedLocations(
  currentLocation: Location | null,
  userLocations: UserFavorites,
) {
  const sortedWorkHomeLocations = currentLocation
    ? sortNearestLocations(
        currentLocation,
        getLegacyUserLocation(userLocations, 'home')?.location!,
        getLegacyUserLocation(userLocations, 'work')?.location!,
      ).map(sl => sl.location)
    : [null, null];

  const [nearest, furthest] = sortedWorkHomeLocations;
  return {nearest, furthest};
}
