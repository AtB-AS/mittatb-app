import type {DateOptionAndValue} from '@atb/components/date-selection';
import type {Location} from '@atb/modules/favorites';

export type SearchForLocations = {
  from?: Location;
  to?: Location;
};

export type SearchStateType =
  | 'idle'
  | 'searching'
  | 'search-success'
  | 'search-empty-result';

export const TripDateOptions = ['now', 'departure', 'arrival'] as const;
export type TripDateOptionType = (typeof TripDateOptions)[number];

export type TripSearchTime = DateOptionAndValue<TripDateOptionType>;

export type TripSearchScreenParams = {
  fromLocation?: Location;
  toLocation?: Location;
  searchTime?: TripSearchTime;
  callerRoute?: {name: string};
};
