import {Statuses} from '@atb/theme';
import {LanguageAndTextType} from '@atb/translations';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AnyMode} from '@atb/components/icon-box';

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
  rules?: Rule[];
};

export type GlobalMessageType = Omit<
  GlobalMessageRaw,
  'appPlatforms' | 'appVersionMin' | 'appVersionMax' | 'startDate' | 'endDate'
> & {startDate?: number; endDate?: number};

export enum RuleVariableName {
  transportModes = 'transportModes',
  zones = 'zones',
  platform = 'platform',
  count = 'count',
}
export type RuleVariables = {
  transportModes?: AnyMode[];
  zones?: string[];
  platform?: string;
  count?: number;
};

export type Rule = {
  variable: RuleVariableName;
  operator: RuleOperator;
  value: RuleValue;
};
export enum RuleOperator {
  equalTo = 'equalTo',
  notEqualTo = 'notEqualTo',
  greaterThan = 'greaterThan',
  lessThan = 'lessThan',
  greaterThanOrEqualTo = 'greaterThanOrEqualTo',
  lessThanOrEqualTo = 'lessThanOrEqualTo',
  arrayContains = 'arrayContains',
}

export type RuleValue = string | number | boolean;
