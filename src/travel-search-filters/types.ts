import {
  FlexibleTransportOptionType,
  TransportModeFilterOptionType,
} from '@atb/configuration';

export {
  TransportModeFilterOptionType,
  TravelSearchFiltersType,
} from '@atb/configuration/types';

export type TransportModeFilterOptionWithSelectionType =
  TransportModeFilterOptionType & {selected: boolean};

export type FlexibleTransportOptionTypeWithSelectionType =
  FlexibleTransportOptionType & {enabled: boolean};

export type TravelSearchFiltersSelectionType = {
  transportModes?: TransportModeFilterOptionWithSelectionType[];
  flexibleTransport?: FlexibleTransportOptionTypeWithSelectionType;
};
