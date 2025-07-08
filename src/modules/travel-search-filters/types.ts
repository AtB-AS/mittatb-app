import {TransportModeFilterOptionType} from '@atb/modules/configuration';
import {
  TravelSearchPreferenceOptionIdType,
  TravelSearchPreferenceType,
} from '@atb-as/config-specs';

export type TransportModeFilterOptionWithSelectionType =
  TransportModeFilterOptionType & {selected: boolean};

export type TravelSearchPreferenceWithSelectionType =
  TravelSearchPreferenceType & {
    selectedOption: TravelSearchPreferenceOptionIdType;
  };

export type TravelSearchFiltersSelectionType = {
  transportModes?: TransportModeFilterOptionWithSelectionType[];
  travelSearchPreferences?: TravelSearchPreferenceWithSelectionType[];
};
