import {Statuses} from '@atb/theme';
import {LanguageAndTextType} from '@atb/translations';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type AppPlatformType = 'ios' | 'android';

export type GlobalMessageContextType =
  | 'app-assistant'
  | 'app-departures'
  | 'app-ticketing'
  | 'web-ticketing'
  | 'web-overview';

export type GlobalMessageRaw = {
  id: string;
  active: boolean;
  title?: LanguageAndTextType[];
  body: LanguageAndTextType[];
  type: Statuses;
  context: GlobalMessageContextType[];
  isDismissable?: boolean;
  appPlatforms: AppPlatformType[];
  appVersionMin: string;
  appVersionMax: string;
  startDate?: FirebaseFirestoreTypes.Timestamp;
  endDate?: FirebaseFirestoreTypes.Timestamp;
};

export type GlobalMessageType = Omit<
  GlobalMessageRaw,
  'appPlatforms' | 'appVersionMin' | 'appVersionMax' | 'startDate' | 'endDate'
> & {startDate?: number; endDate?: number};
