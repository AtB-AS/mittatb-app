import {Polygon} from 'geojson';
import {LanguageAndTextType} from '@atb/translations';
import {FareProductTypeConfig} from '@atb/screens/Ticketing/FareContracts/utils';

export type PreassignedFareProductType =
  | 'single'
  | 'night'
  | 'period'
  | 'carnet'
  | 'hour24';
export type DistributionChannel = 'web' | 'app';

export type PreassignedFareProduct = {
  id: string;
  name: LanguageAndTextType;
  version: string;
  description?: LanguageAndTextType[];
  type: PreassignedFareProductType;
  durationDays: number;
  distributionChannel: DistributionChannel[];
  alternativeNames: LanguageAndTextType[];
  limitations: {
    userProfileRefs: string[];
  };
};

export type PreassignedFareProductWithConfig = PreassignedFareProduct & {
  config: FareProductTypeConfig;
};

export type UserProfile = {
  id: string;
  minAge?: number;
  maxAge: number;
  userType: number;
  userTypeString: string;
  name: LanguageAndTextType;
  alternativeNames: LanguageAndTextType[];
  description: LanguageAndTextType;
  version: string;
};

export type TariffZone = {
  id: string;
  name: LanguageAndTextType;
  version: string;
  geometry: Omit<Polygon, 'type'> & {type: any};
};
