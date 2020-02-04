import {Location, UserLocations} from '../../../AppContext';
import {Direction, Origin} from './';

export default function useCalculateTrip(
  currentLocation: Location | null,
  userLocations: UserLocations,
  origin: Origin,
  direction: Direction,
) {
  const {home, work} = userLocations;

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
