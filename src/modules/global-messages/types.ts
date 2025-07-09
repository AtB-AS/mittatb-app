import {Statuses} from '@atb/theme';
import {LanguageAndTextType} from '@atb/translations';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Rule} from '@atb/modules/rule-engine';

import {z} from 'zod';

export const AppPlatformSchema = z.enum(['ios', 'android']);
export type AppPlatform = z.infer<typeof AppPlatformSchema>;

export enum GlobalMessageContextEnum {
  appAssistant = 'app-assistant',
  appDepartures = 'app-departures',
  appTicketing = 'app-ticketing',
  appPurchaseOverview = 'app-purchase-overview',
  appPurchaseConfirmation = 'app-purchase-confirmation',
  appPurchaseConfirmationBottom = 'app-purchase-confirmation-bottom',
  appFareContractDetails = 'app-fare-contract-details',
  appDepartureDetails = 'app-departure-details',
  appTripDetails = 'app-trip-details',
  appTripResults = 'app-trip-results',
  appServiceDisruptions = 'app-service-disruptions',
  appLogin = 'app-login',
  appLoginPhone = 'app-login-phone',
}

export type GlobalMessageRaw = {
  id: string;
  active: boolean;
  title?: LanguageAndTextType[];
  body: LanguageAndTextType[];
  link?: LanguageAndTextType[];
  linkText?: LanguageAndTextType[];
  type: Statuses;
  subtle?: boolean;
  context: GlobalMessageContextEnum[];
  isDismissable?: boolean;
  appPlatforms: AppPlatform[];
  appVersionMin: string;
  appVersionMax: string;
  startDate?: FirebaseFirestoreTypes.Timestamp;
  endDate?: FirebaseFirestoreTypes.Timestamp;
  rules?: Rule[];
};

export type GlobalMessageType = Omit<
  GlobalMessageRaw,
  'appPlatforms' | 'appVersionMin' | 'appVersionMax' | 'startDate' | 'endDate'
> & {startDate?: number; endDate?: number};
