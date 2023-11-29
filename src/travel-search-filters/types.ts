import {
  FlexibleTransportOptionType,
  TransportModeFilterOptionType,
} from '@atb/configuration';
import {
  TravelSearchPreference,
  TravelSearchPreferenceOptionId,
} from '@atb-as/config-specs';

export {
  TransportModeFilterOptionType,
  TravelSearchFiltersType,
} from '@atb/configuration/types';

export type TransportModeFilterOptionWithSelectionType =
  TransportModeFilterOptionType & {selected: boolean};

export type FlexibleTransportOptionTypeWithSelectionType =
  FlexibleTransportOptionType & {enabled: boolean};

export type TravelSearchPreferenceWithSelectionType = TravelSearchPreference & {
  selectedOption: TravelSearchPreferenceOptionId;
};

export type TravelSearchFiltersSelectionType = {
  transportModes?: TransportModeFilterOptionWithSelectionType[];
  flexibleTransport?: FlexibleTransportOptionTypeWithSelectionType;
  travelSearchPreferences?: TravelSearchPreferenceWithSelectionType[];
};
