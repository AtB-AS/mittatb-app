import {LanguageAndText} from '@atb/reference-data/types';
import {Statuses} from '@atb/theme';

export type AppPlatformType = 'ios' | 'android';

export type GlobalMessageContext =
  | 'app-assistant'
  | 'app-departures'
  | 'app-ticketing'
  | 'web-ticketing'
  | 'web-overview';

export type GlobalMessageRaw = {
  id: string;
  active: boolean;
  title?: LanguageAndText[];
  body: LanguageAndText[];
  type: Statuses;
  context: GlobalMessageContext[];
  isDismissable?: boolean;
  appPlatform: AppPlatformType[];
  appVersionMin: string;
  appVersionMax: string;
};

export type GlobalMessageType = {
  id: string;
  active: boolean;
  title?: LanguageAndText[];
  body: LanguageAndText[];
  type: Statuses;
  context: GlobalMessageContext[];
  isDismissable?: boolean;
};
