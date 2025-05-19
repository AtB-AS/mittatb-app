import {LanguageAndTextType} from '@atb/modules/configuration';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AppPlatformType} from '@atb/modules/global-messages';
import {Rule} from '@atb/modules/rule-engine';

export type AnnouncementId = string;

export enum ActionType {
  external = 'external',
  deeplink = 'deeplink',
  bottom_sheet = 'bottom_sheet',
}

export type BottomSheetActionButton = {
  label?: LanguageAndTextType[];
  actionType: Extract<ActionType, ActionType.bottom_sheet>;
};

export type UrlActionButton = {
  label?: LanguageAndTextType[];
  url: string;
  actionType: Extract<ActionType, ActionType.external | ActionType.deeplink>;
};

export type ActionButton = BottomSheetActionButton | UrlActionButton;

export type AnnouncementRaw = {
  id: AnnouncementId;
  active: boolean;
  summaryTitle?: LanguageAndTextType[];
  summary: LanguageAndTextType[];
  summaryImage?: string;
  fullTitle: LanguageAndTextType[];
  body: LanguageAndTextType[];
  mainImage?: string;
  isDismissable?: boolean;
  appPlatforms: AppPlatformType[];
  appVersionMin: string;
  appVersionMax: string;
  startDate?: FirebaseFirestoreTypes.Timestamp;
  endDate?: FirebaseFirestoreTypes.Timestamp;
  rules?: Rule[];
  actionButton?: ActionButton;
};

export type AnnouncementType = Omit<
  AnnouncementRaw,
  'appPlatforms' | 'appVersionMin' | 'appVersionMax' | 'startDate' | 'endDate'
> & {
  startDate?: number;
  endDate?: number;
  actionButton: ActionButton;
};
