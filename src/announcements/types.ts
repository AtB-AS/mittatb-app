import {LanguageAndTextType} from '@atb-as/config-specs';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type AnnouncementRaw = {
  id: string;
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
  'startDate' | 'endDate' | 'summaryImage' | 'mainImage'
> & {
  startDate?: number;
  endDate?: number;
  summaryImageUrl?: string;
  mainImageUrl?: string;
};
