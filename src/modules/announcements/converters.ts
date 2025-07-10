import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AppPlatform} from '@atb/modules/global-messages';
import {Platform} from 'react-native';
import {APP_VERSION} from '@env';
import {
  AnnouncementRaw,
  AnnouncementTypeSchema,
  AnnouncementType,
} from './types';
import {isDefined} from '@atb/utils/presence';

type FirestoreAnnouncementDocument =
  FirebaseFirestoreTypes.QueryDocumentSnapshot<AnnouncementRaw>;

export const mapToAnnouncements = (
  firestoreAnnouncementDocuments: FirestoreAnnouncementDocument[],
): AnnouncementType[] => {
  if (!Array.isArray(firestoreAnnouncementDocuments)) return [];

  const safeParsedAnnouncements = firestoreAnnouncementDocuments
    .map((doc) => mapToAnnouncement(doc))
    .filter(isDefined);

  const applicableAnnouncements = safeParsedAnnouncements.filter(
    (announcement) =>
      announcement.active &&
      appliesToAppPlaform(announcement.appPlatforms) &&
      appliesToAppVersion(
        announcement.appVersionMin,
        announcement.appVersionMax,
      ),
  );
  return applicableAnnouncements;
};

export const mapToAnnouncement = (
  firestoreAnnouncementDocument: FirestoreAnnouncementDocument,
): AnnouncementType | undefined => {
  const data = firestoreAnnouncementDocument.data();
  const parseResult = AnnouncementTypeSchema.safeParse({
    ...data,
    id: firestoreAnnouncementDocument.id,
  });
  if (parseResult.success) {
    return parseResult.data;
  } else {
    console.warn(parseResult.error);
  }
};

const appliesToAppPlaform = (platforms: AppPlatform[]) => {
  if (!platforms) return true;
  return !!platforms.find(
    (platform) => platform.toLowerCase() === Platform.OS.toLowerCase(),
  );
};

const appliesToAppVersion = (
  appVersionMin?: string,
  appVersionMax?: string,
) => {
  if (appVersionMin && appVersionMin > APP_VERSION) return false;
  if (appVersionMax && appVersionMax < APP_VERSION) return false;
};
