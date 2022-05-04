import {Polygon} from 'geojson';

export type LanguageAndText = {
  lang: string;
  value: string;
};

export type PreassignedFareProductType = 'single' | 'period' | 'carnet';

export type DistributionChannel = 'web' | 'app';

export type PreassignedFareProduct = {
  id: string;
  name: LanguageAndText;
  description?: LanguageAndText;
  alternativeNames: LanguageAndText[];
  distributionChannel: DistributionChannel[];
  version: string;
  type: PreassignedFareProductType;
  durationDays: 1 | 7 | 30 | 60 | 90 | 120 | 150 | 180 | 360;
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
  name: LanguageAndText;
  alternativeNames: LanguageAndText[];
  description: LanguageAndText;
  version: string;
};

export type TariffZone = {
  id: string;
  name: LanguageAndText;
  version: string;
  geometry: Omit<Polygon, 'type'> & {type: any};
};
