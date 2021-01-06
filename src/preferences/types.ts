import {ColorSchemeName} from 'react-native';
import {appLanguages} from '../translations';
export const preference_screenAlternatives = [
  'assistant',
  'departures',
  'ticketing',
] as const;

export type Preference_ScreenAlternatives = typeof preference_screenAlternatives[number];

export type Preference_Language = typeof appLanguages[number];

export type UserPreferences = {
  startScreen?: Preference_ScreenAlternatives;
  colorScheme?: ColorSchemeName;
  overrideColorScheme?: boolean;
  language?: Preference_Language;
  useSystemLanguage?: boolean;
};

export type PreferenceItem = keyof UserPreferences;
