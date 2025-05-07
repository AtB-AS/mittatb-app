import {
  FlexibleTransportOptionType,
  TransportModeFilterOptionType,
} from '@atb/modules/configuration';
import {
  TravelSearchPreferenceOptionIdType,
  TravelSearchPreferenceType,
} from '@atb-as/config-specs';

export type TransportModeFilterOptionWithSelectionType =
  TransportModeFilterOptionType & {selected: boolean};

export type FlexibleTransportOptionTypeWithSelectionType =
  FlexibleTransportOptionType & {enabled: boolean};

export type TravelSearchPreferenceWithSelectionType =
  TravelSearchPreferenceType & {
    selectedOption: TravelSearchPreferenceOptionIdType;
  };

export type TravelSearchFiltersSelectionType = {
  transportModes?: TransportModeFilterOptionWithSelectionType[];
  flexibleTransport?: FlexibleTransportOptionTypeWithSelectionType;
  travelSearchPreferences?: TravelSearchPreferenceWithSelectionType[];
};
