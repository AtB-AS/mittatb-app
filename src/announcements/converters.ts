import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AnnouncementRaw, AnnouncementType} from './types';
import {mapToLanguageAndTexts} from '@atb/utils/map-to-language-and-texts';
import storage from '@react-native-firebase/storage';

export const mapToAnnouncements = async (
  result: FirebaseFirestoreTypes.QueryDocumentSnapshot<AnnouncementRaw>[],
) => {
  if (!result) return [];

  const announcements = result.map((doc) =>
    mapToAnnouncement(doc.id, doc.data()),
  );
  return Promise.all(announcements).then((res) =>
    res.filter((a): a is AnnouncementType => !!a),
  );
};

export const mapToAnnouncement = async (
  id: string,
  result: AnnouncementRaw,
): Promise<AnnouncementType | undefined> => {
  if (!result) return;

  const summaryTitle = mapToLanguageAndTexts(result.summaryTitle);
  const summary = mapToLanguageAndTexts(result.summary);
  const summaryImageUrl = await mapToDownloadUrl(result.summaryImage);
  const fullTitle = mapToLanguageAndTexts(result.fullTitle);
  const body = mapToLanguageAndTexts(result.body);
  const mainImageUrl = await mapToDownloadUrl(result.mainImage);
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
    summaryImageUrl,
    fullTitle,
    body,
    mainImageUrl,
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

const mapToDownloadUrl = async (path: string | undefined) => {
  if (!path) return;
  return await storage()
    .ref(path)
    .getDownloadURL()
    .catch((err) => {
      //TOOD: Bugsnag
      console.warn(err);
      return undefined;
    });
};
