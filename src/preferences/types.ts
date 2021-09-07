import {PaymentType} from '@atb/tickets';
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
  overrideSystemAppearance?: boolean;
  useAndroidSystemFont?: boolean;
  language?: Preference_Language;
  useSystemLanguage?: boolean;
  defaultUserTypeString?: string;
  departuresShowOnlyFavorites?: boolean;
  previousPaymentMethod?: SavedPaymentOption;
};

export type PreferenceItem = keyof UserPreferences;

export type SavedRecurringPayment = {
  id: number;
  expires_at: string;
  masked_pan: string;
  payment_type: number;
};

export type SavedPaymentOption =
  | {
      savedType: 'normal';
      paymentType: PaymentType;
    }
  | {
      savedType: 'recurring';
      paymentType: PaymentType.VISA | PaymentType.MasterCard;
      recurringCard: SavedRecurringPayment;
    };
