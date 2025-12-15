import {ColorSchemeName} from 'react-native';
import {appLanguages} from '@atb/translations';

export const preference_screenAlternatives = [
  'assistant',
  'departures',
  'ticketing',
] as const;

export type Preference_ScreenAlternatives =
  (typeof preference_screenAlternatives)[number];

export type Preference_Language = (typeof appLanguages)[number];

export type UserPreferences = {
  startScreen?: Preference_ScreenAlternatives;
  colorScheme?: ColorSchemeName;
  overrideSystemAppearance?: boolean;
  useAndroidSystemFont?: boolean;
  language?: Preference_Language;
  useSystemLanguage?: boolean;
  defaultUserTypeString?: string;
  departuresShowOnlyFavorites?: boolean;
  showTestIds?: boolean;
  hideProductDescriptions?: boolean;
  debugShowSeconds?: boolean;
  // A toggle inside the accessibility settings: it only disables the travel aid feature in the app,
  // not the entire accessibility settings
  journeyAidEnabled?: boolean;
  debugPredictionInaccurate?: boolean;
  debugShowProgressBetweenStops?: boolean;
  showShmoTesting?: boolean;
};

export type PreferenceItem = keyof UserPreferences;
