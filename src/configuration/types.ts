import {Polygon} from 'geojson';
import {LanguageAndTextType} from '@atb/translations';
import {ZoneSelectionMode} from '@atb-as/config-specs';

export * from '@atb-as/config-specs';
export * from '@atb-as/config-specs/lib/mobility-operators';

export type FirestoreConfigStatus = 'loading' | 'success';

export type DistributionChannel = 'web' | 'app' | 'debug-web' | 'debug-app';

export type PreassignedFareProductId = string;

export type PreassignedFareProduct = {
  id: PreassignedFareProductId;
  name: LanguageAndTextType;
  version: string;
  description?: LanguageAndTextType[];
  productDescription?: LanguageAndTextType[];
  warningMessage?: LanguageAndTextType[];
  type: string;
  productAlias?: LanguageAndTextType[];
  distributionChannel: DistributionChannel[];
  alternativeNames: LanguageAndTextType[];
  zoneSelectionMode?: ZoneSelectionMode;
  limitations: {
    userProfileRefs: string[];
    appVersionMin: string | undefined;
    appVersionMax: string | undefined;
    latestActivationDate?: number;
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
  alternativeDescriptions: LanguageAndTextType[];
  version: string;
  emoji?: string;
  hideFromDefaultTravellerSelection?: boolean;
};

export type TariffZone = {
  id: string;
  name: LanguageAndTextType;
  version: string;
  geometry: Omit<Polygon, 'type'> & {type: any};
  isDefault?: boolean;
  description: LanguageAndTextType[];
};

export type PointToPointValidity = {
  fromPlace: string;
  toPlace: string;
};

export type CityZone = {
  id: string;
  name: string;
  enabled: boolean;
  moreInfoUrl?: LanguageAndTextType[];
  orderUrl?: LanguageAndTextType[];
  phoneNumber?: string;
  geometry: Omit<Polygon, 'type'> & {type: any};
};
