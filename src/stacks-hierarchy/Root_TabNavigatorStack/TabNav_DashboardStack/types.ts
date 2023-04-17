import {TripPattern} from '@atb/api/types/trips';

import {TravelSearchTransport} from '@atb-as/config-specs';
import {TransportModes} from '@atb/api/types/generated/journey_planner_v3_types';
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

export type TransportIconModeType = Omit<
  TransportModes,
  'transportSubModes'
> & {
  transportSubMode?: Required<TransportModes>['transportSubModes'][0];
};

export {
  TravelSearchFiltersType,
  TravelSearchTransport,
} from '@atb-as/config-specs';

export type TransportModeFilterOptionWithSelectionType =
  TravelSearchTransport & {selected: boolean};

export type TravelSearchFiltersSelectionType = {
  transportModes?: TransportModeFilterOptionWithSelectionType[];
};
