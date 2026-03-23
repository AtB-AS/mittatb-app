import type {DateOptionAndValue} from '@atb/components/date-selection';
import type {Location} from '@atb/modules/favorites';
import {DashboardScreenProps} from './navigation-types';
import type {SelectableLocationType} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';

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

// Valid screens that can be navigated to from the trip search screen
export type TripSearchCallerRoute = Parameters<
  DashboardScreenProps<'Dashboard_TripSearchScreen'>['navigation']['popTo']
>;

export type TripSearchScreenParams = {
  fromLocation?: SelectableLocationType;
  toLocation?: SelectableLocationType;
  searchTime?: TripSearchTime;
  callerRoute?: TripSearchCallerRoute;
};
