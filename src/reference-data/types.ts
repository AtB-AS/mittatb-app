export type Language = 'nob' | 'nno' | 'nor' | 'eng';

export type LanguageAndText = {
  lang: Language;
  value: string;
};

export type PreassignedFareProduct = {
  id: string;
  name: LanguageAndText;
  description: LanguageAndText | {};
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
  geometry: {
    interior: number[][];
    exterior: number[][];
  };
};
