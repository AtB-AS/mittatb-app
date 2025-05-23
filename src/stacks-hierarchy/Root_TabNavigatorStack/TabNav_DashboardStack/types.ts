import type {Location} from '@atb/modules/favorites';
import type {TripSearchTime} from '@atb/modules/trip-search';

export type SearchForLocations = {
  from?: Location;
  to?: Location;
};

export const TripDateOptions = ['now', 'departure', 'arrival'] as const;
export type TripDateOptionType = (typeof TripDateOptions)[number];

export type TripSearchScreenParams = {
  fromLocation?: Location;
  toLocation?: Location;
  searchTime?: TripSearchTime;
  callerRoute?: {name: string};
};
