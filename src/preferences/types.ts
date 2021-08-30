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
  defaultUserTypeString?: string;
  departuresShowOnlyFavorites?: boolean;
};

export type PreferenceItem = keyof UserPreferences;

export type PaymentOption = {
  /// 1: 'creditcard', 2: 'VIPPS', 3: 'VISA, 4: 'MASTERCARD'
  type: number,
  masked_pan?: string,
  id?: string,
  save?: boolean,
  description: string,
  accessibilityHint: string,
  expires_at?: string,
}
