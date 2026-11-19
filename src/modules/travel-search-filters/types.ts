import {TransportModeFilterOptionType} from '@atb/modules/configuration';
import {
  TravelSearchPreferenceOptionIdType,
  TravelSearchPreferenceParameterType,
  TravelSearchPreferenceType,
} from '@atb-as/config-specs';

export type TransportModeFilterOptionWithSelectionType =
  TransportModeFilterOptionType & {selected: boolean};

export type TravelSearchPreferenceWithSelectionType =
  TravelSearchPreferenceType & {
    selectedOption: TravelSearchPreferenceOptionIdType;
    overrideValue?: number;
  };

export type TravelSearchFiltersSelectionType = {
  transportModes?: TransportModeFilterOptionWithSelectionType[];
  travelSearchPreferences?: TravelSearchPreferenceWithSelectionType[];
};

/**
 * Filters that will override the user's stored selection. These are not saved
 * on the device.
 */
export type InitialTravelSearchFilters = {
  transportModes?: string[];
  travelSearchPreferences?: Partial<
    Record<TravelSearchPreferenceParameterType, number>
  >;
};
