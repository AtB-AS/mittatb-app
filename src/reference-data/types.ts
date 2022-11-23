import {Polygon} from 'geojson';
import {LanguageAndTextType} from '@atb/translations';

export type PreassignedFareProductType =
  | 'single'
  | 'night'
  | 'period'
  | 'carnet'
  | 'hour24';
export type PreassignedFareProductZoneSelectionMode =
  | 'single'
  | 'multiple'
  | 'none';
export type PreassignedFareProductTravellerSelectionMode =
  | 'multiple'
  | 'single'
  | 'none';
export type PreassignedFareProductTimeSelectionMode = 'datetime' | 'none';
export type PreassignedFareProductProductSelectionMode =
  | 'duration'
  | 'product'
  | 'none';
export type PreassignedFareProductOfferEndpoint = 'zones' | 'authority';
export type PreassignedFareProductConfigurations = {
  zoneSelectionMode: PreassignedFareProductZoneSelectionMode;
  travellerSelectionMode: PreassignedFareProductTravellerSelectionMode;
  timeSelectionMode: PreassignedFareProductTimeSelectionMode;
  productSelectionMode: PreassignedFareProductProductSelectionMode;
  offerEndpoint: PreassignedFareProductOfferEndpoint;
};

export type DistributionChannel = 'web' | 'app';

export type PreassignedFareProduct = {
  id: string;
  name: LanguageAndTextType;
  version: string;
  description?: LanguageAndTextType;
  type: PreassignedFareProductType;
  durationDays: number;
  distributionChannel: DistributionChannel[];
  alternativeNames: LanguageAndTextType[];
  limitations: {
    userProfileRefs: string[];
  };
  configurations: PreassignedFareProductConfigurations;
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
