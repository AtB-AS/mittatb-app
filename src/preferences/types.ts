import {ColorSchemeName} from 'react-native';

export const preference_screenAlternatives = [
  'assistant',
  'departures',
  'ticketing',
] as const;
export type Preference_ScreenAlternatives = typeof preference_screenAlternatives[number];

export type UserPreferences = {
  startScreen?: Preference_ScreenAlternatives;
  colorScheme?: ColorSchemeName;
  overrideColorScheme?: boolean;
};

export type PreferenceItem = keyof UserPreferences;
