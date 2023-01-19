import {TripPattern} from '@atb/api/types/trips';

import {Location} from '@atb/favorites/types';
import {SearchTime} from '@atb/journey-date-picker';
import {TransportModes} from '@atb/api/types/generated/journey_planner_v3_types';
import {LanguageAndTextType} from '@atb/translations';

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

export type TransportModeFilterOptionType = {
  id: string;
  icon: TransportIconModeType;
  text: LanguageAndTextType[];
  description?: LanguageAndTextType[];
  modes: TransportModes[];
};

export type TravelSearchFiltersType = {
  transportModes?: TransportModeFilterOptionType[];
};

export type TransportModeFilterOptionWithSelectionType =
  TransportModeFilterOptionType & {selected: boolean};

export type TravelSearchFiltersSelectionType = {
  transportModes?: TransportModeFilterOptionWithSelectionType[];
};
