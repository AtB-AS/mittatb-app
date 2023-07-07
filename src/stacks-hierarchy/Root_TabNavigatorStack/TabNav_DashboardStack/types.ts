import {TripPattern} from '@atb/api/types/trips';
import {Location} from '@atb/favorites';
import {SearchTime} from '@atb/journey-date-picker';

export type SearchForLocations = {
  from?: Location;
  to?: Location;
};

export type SearchStateType =
  | 'idle'
  | 'searching'
  | 'search-success'
  | 'search-empty-result';

export type TripPatternWithKey = TripPattern & {key: string};
export type TripSearchScreenParams = {
  fromLocation?: Location;
  toLocation?: Location;
  searchTime?: SearchTime;
  callerRoute?: {name: string};
};
