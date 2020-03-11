import {Direction, Origin} from './';
import {UserFavorites, Location} from '../../../favorites/types';

function getLegacyUserLocation(
  userLocations: UserFavorites | null,
  type: 'home' | 'work',
) {
  return userLocations?.find(i => i.name === type) ?? null;
}
export default function useCalculateTrip(
  currentLocation: Location | null,
  userLocations: UserFavorites,
  origin: Origin,
  direction: Direction,
): {from: Location; to: Location} {
  const home = getLegacyUserLocation(userLocations, 'home')?.location!;
  const work = getLegacyUserLocation(userLocations, 'work')?.location!;

  if (currentLocation) {
    const from =
      origin === 'current'
        ? currentLocation
        : direction === 'home'
        ? work
        : home;
    const to = direction === 'home' ? home : work;
    return {from, to};
  } else {
    return direction === 'home'
      ? {from: work, to: home}
      : {from: home, to: work};
  }
}
