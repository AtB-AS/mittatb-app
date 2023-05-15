import {Polygon} from 'geojson';
import {LanguageAndTextType} from '@atb/translations';
import {ZoneSelectionMode} from '@atb-as/config-specs';

export type DistributionChannel = 'web' | 'app';

export type PreassignedFareProduct = {
  id: string;
  name: LanguageAndTextType;
  version: string;
  description?: LanguageAndTextType[];
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
};

export type TariffZone = {
  id: string;
  name: LanguageAndTextType;
  version: string;
  geometry: Omit<Polygon, 'type'> & {type: any};
  isDefault?: boolean;
};

export type CityZone = {
  name: string;
  enabled: boolean;
  contactUrl: LanguageAndTextType[];
  geometry: Omit<Polygon, 'type'> & {type: any};
};
