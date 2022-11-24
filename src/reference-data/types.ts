import {Polygon} from 'geojson';
import {LanguageAndTextType} from '@atb/translations';

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
  description?: LanguageAndTextType;
  alternativeNames: LanguageAndTextType[];
  distributionChannel: DistributionChannel[];
  version: string;
  type: PreassignedFareProductType;
  durationDays: number;
  isApplicableOnSingleZoneOnly?: boolean;
  limitations: {
    userProfileRefs: string[];
  };
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
