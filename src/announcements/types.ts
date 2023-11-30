import { LanguageAndTextType } from '@atb/configuration';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { AppPlatformType } from '@atb/global-messages/types';
import { Rule } from '@atb/rule-engine/rules';

export type AnnouncementId = string;

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
};

export type AnnouncementType = Omit<
  AnnouncementRaw,
  'appPlatforms' | 'appVersionMin' | 'appVersionMax' | 'startDate' | 'endDate'
> & {
  startDate?: number;
  endDate?: number;
};
