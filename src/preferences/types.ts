import {PaymentType} from '@atb/tickets';
import {ColorSchemeName} from 'react-native';
import {appLanguages} from '../translations';
export const preference_screenAlternatives = [
  'assistant',
  'departures',
  'ticketing',
] as const;

export type Preference_ScreenAlternatives =
  typeof preference_screenAlternatives[number];

export type Preference_Language = typeof appLanguages[number];

export type TripSearchPreferences = {
  transferPenalty?: number;
  waitReluctance?: number;
  walkReluctance?: number;
  walkSpeed?: number;
};

export type UserPreferences = {
  startScreen?: Preference_ScreenAlternatives;
  colorScheme?: ColorSchemeName;
  overrideSystemAppearance?: boolean;
  useAndroidSystemFont?: boolean;
  language?: Preference_Language;
  useSystemLanguage?: boolean;
  defaultUserTypeString?: string;
  departuresShowOnlyFavorites?: boolean;
  newDepartures?: boolean;
  useExperimentalTripSearch?: boolean;
  showTestIds?: boolean;
  tripSearchPreferences?: TripSearchPreferences;
};

export type PreferenceItem = keyof UserPreferences;
