import {TripPattern} from '@atb/api/types/trips';

import {TransportModes} from '@atb/api/types/generated/journey_planner_v3_types';
import {Location} from '@atb/favorites';
import {SearchTime} from '@atb/journey-date-picker';
import {
  FlexibleTransportOptionType,
  TransportModeFilterOptionType,
} from '@atb-as/config-specs';

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
  TransportModeFilterOptionType,
  TravelSearchFiltersType,
} from '@atb-as/config-specs';

export type TransportModeFilterOptionWithSelectionType =
  TransportModeFilterOptionType & {selected: boolean};

export type FlexibleTransportOptionTypeWithSelectionType =
  FlexibleTransportOptionType & {enabled: boolean};

export type TravelSearchFiltersSelectionType = {
  transportModes?: TransportModeFilterOptionWithSelectionType[];
  flexibleTransport?: FlexibleTransportOptionTypeWithSelectionType;
};
