import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AnnouncementRaw, AnnouncementType} from './types';
import {mapToLanguageAndTexts} from '@atb/utils/map-to-language-and-texts';

export const mapToAnnouncements = (
  result: FirebaseFirestoreTypes.QueryDocumentSnapshot<AnnouncementRaw>[],
) => {
  if (!result) return [];

  return result
    .map((doc) => mapToAnnouncement(doc.id, doc.data()))
    .filter((a): a is AnnouncementType => !!a);
};

export const mapToAnnouncement = (
  id: string,
  result: AnnouncementRaw,
): AnnouncementType | undefined => {
  if (!result) return;
  if (!result.active) return;

  const summaryTitle = mapToLanguageAndTexts(result.summaryTitle);
  const summary = mapToLanguageAndTexts(result.summary);
  const summaryImage = result.summaryImage;
  const fullTitle = mapToLanguageAndTexts(result.fullTitle);
  const body = mapToLanguageAndTexts(result.body);
  const mainImage = result.mainImage;
  const isDismissable = result.isDismissable;
  const startDate = mapToMillis(result.startDate);
  const endDate = mapToMillis(result.endDate);

  if (!summary) return;
  if (!fullTitle) return;
  if (!body) return;

  return {
    id,
    summaryTitle,
    summary,
    summaryImage,
    fullTitle,
    body,
    mainImage,
    isDismissable,
    startDate,
    endDate,
  };
};

export const mapToMillis = (
  timestamp?: FirebaseFirestoreTypes.Timestamp,
): number | undefined => {
  if (!timestamp) return;
  if (typeof timestamp !== 'object') return;
  if (!timestamp.toMillis) return;
  return timestamp.toMillis();
};
