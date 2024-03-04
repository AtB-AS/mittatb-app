import {Statuses} from '@atb/theme';
import {LanguageAndTextType} from '@atb/translations';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Rule} from '../rule-engine/rules';

export type AppPlatformType = 'ios' | 'android';

export enum GlobalMessageContextEnum {
  appAssistant = 'app-assistant',
  appDepartures = 'app-departures',
  appTicketing = 'app-ticketing',
  appPurchaseOverview = 'app-purchase-overview',
  appPurchaseConfirmation = 'app-purchase-confirmation',
  appFareContractDetails = 'app-fare-contract-details',
  appDepartureDetails = 'app-departure-details',
  appTripDetails = 'app-trip-details',
  appServiceDisruptions = 'app-service-disruptions',
}

export type GlobalMessageRaw = {
  id: string;
  active: boolean;
  title?: LanguageAndTextType[];
  body: LanguageAndTextType[];
  type: Statuses;
  subtle?: boolean;
  context: GlobalMessageContextEnum[];
  isDismissable?: boolean;
  appPlatforms: AppPlatformType[];
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
