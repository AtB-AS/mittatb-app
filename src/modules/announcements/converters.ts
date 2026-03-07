import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Announcement} from './types';
import {isDefined} from '@atb/utils/presence';
import {
  appliesToAppPlaform,
  appliesToAppVersion,
} from '@atb/utils/firestore-utils';

export const mapToAnnouncements = (
  snapshots: FirebaseFirestoreTypes.QueryDocumentSnapshot[],
): Announcement[] => {
  if (!Array.isArray(snapshots)) return [];

  const announcements = snapshots
    .map((snapshot) => mapToAnnouncement(snapshot))
    .filter(isDefined)
    .sort((a, b) => a.sortByIndex - b.sortByIndex);

  const applicableAnnouncements = announcements.filter(
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
  snapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot,
): Announcement | undefined => {
  const data = snapshot.data();
  const parseResult = Announcement.safeParse({
    ...data,
    id: snapshot.id,
  });
  if (parseResult.success) {
    return parseResult.data;
  } else {
    console.warn(
      `Announcement with id ${snapshot?.id} failed safeParsing:\n`,
      parseResult.error,
    );
  }
};
