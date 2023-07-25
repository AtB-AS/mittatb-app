import {
  FlexibleTransportOptionType,
  TransportModeFilterOptionType,
} from '@atb-as/config-specs';

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
