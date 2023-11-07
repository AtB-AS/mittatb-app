import {LanguageAndTextType} from '@atb/configuration';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

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
  startDate?: FirebaseFirestoreTypes.Timestamp;
  endDate?: FirebaseFirestoreTypes.Timestamp;
};

export type AnnouncementType = Omit<
  AnnouncementRaw,
  'active' | 'startDate' | 'endDate'
> & {
  startDate?: number;
  endDate?: number;
};
