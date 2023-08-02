import {Statuses} from '@atb/theme';
import {LanguageAndTextType} from '@atb/translations';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AnyMode} from '@atb/components/icon-box';

export type AppPlatformType = 'ios' | 'android';

export enum GlobalMessageContextEnum {
  appAssistant = 'app-assistant',
  appDepartures = 'app-departures',
  appTicketing = 'app-ticketing',
  appCollabticket = 'app-collabticket',
  appTrainOutsideZoneA = 'app-train-outside-zone-a',
}

export type GlobalMessageRaw = {
  id: string;
  active: boolean;
  title?: LanguageAndTextType[];
  body: LanguageAndTextType[];
  type: Statuses;
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

export type RuleVariables = {
  modes?: AnyMode[];
  fromZones?: string[];
  toZones?: string[];
  platform?: string;
  count?: number;
};

export type Rule = {
  variable: string; // key of RuleVariables
  operator: RuleOperator;
  value: string | number | boolean;
  passOnUndefined?: boolean;
};

export enum RuleOperator {
  equalTo = 'equalTo',
  notEqualTo = 'notEqualTo',
  greaterThan = 'greaterThan',
  lessThan = 'lessThan',
  greaterThanOrEqualTo = 'greaterThanOrEqualTo',
  lessThanOrEqualTo = 'lessThanOrEqualTo',
  contains = 'contains',
  notContains = 'notContains',
}
