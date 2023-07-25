import {Location} from '@atb/favorites';
import {SearchTime} from '@atb/journey-date-picker';
import {
  TripPatternWithKey,
  BookingRequirement,
} from '@atb/travel-details-screens/types';

export type SearchForLocations = {
  from?: Location;
  to?: Location;
};

export type SearchStateType =
  | 'idle'
  | 'searching'
  | 'search-success'
  | 'search-empty-result';

export type TripSearchScreenParams = {
  fromLocation?: Location;
  toLocation?: Location;
  searchTime?: SearchTime;
  callerRoute?: {name: string};
};

export type AvailableTripPattern = TripPatternWithKey & {
  bookingRequirement: BookingRequirement;
};
