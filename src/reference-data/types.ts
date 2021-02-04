import {Polygon} from 'geojson';

export enum Language {
  'nob' = 'nob',
  'nno' = 'nno',
  'nor' = 'nor',
  'eng' = 'eng',
}

export type LanguageAndText = {
  lang: string;
  value: string;
};

export type PreassignedFareProduct = {
  id: string;
  name: LanguageAndText;
  description?: LanguageAndText;
  alternativeNames: LanguageAndText[];
  version: string;
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
