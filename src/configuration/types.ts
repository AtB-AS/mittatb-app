import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {LanguageAndTextType} from '@atb/translations';

export type TransportModeType = {
  mode: TransportMode;
  subMode?: TransportSubmode;
};

export type FareProductTypeConfig = {
  type: string;
  illustration?: string;
  name: LanguageAndTextType[];
  transportModes: TransportModeType[];
  description: LanguageAndTextType[];
  configuration: FareProductTypeConfigSettings;
};

export type FareProductTypeConfigSettings = {
  zoneSelectionMode: ZoneSelectionMode;
  travellerSelectionMode: TravellerSelectionMode;
  timeSelectionMode: TimeSelectionMode;
  productSelectionMode: ProductSelectionMode;
  productSelectionTitle?: LanguageAndTextType[];
  requiresLogin: boolean;
};

export type ZoneSelectionMode = 'single' | 'multiple' | 'none';
export type TravellerSelectionMode = 'multiple' | 'single' | 'none';
export type TimeSelectionMode = 'datetime' | 'none';
export type ProductSelectionMode =
  | 'duration'
  | 'product'
  | 'productAlias'
  | 'none';
