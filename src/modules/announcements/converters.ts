import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AppPlatform} from '@atb/modules/global-messages';
import {Platform} from 'react-native';
import {APP_VERSION} from '@env';
import {Announcement} from './types';
import {isDefined} from '@atb/utils/presence';
import {compareVersion} from '@atb/utils/compare-version';

export const mapToAnnouncements = (
  snapshots: FirebaseFirestoreTypes.QueryDocumentSnapshot[],
): Announcement[] => {
  if (!Array.isArray(snapshots)) return [];

  const announcements = snapshots
    .map((snapshot) => mapToAnnouncement(snapshot))
    .filter(isDefined);

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
  if (appVersionMin && compareVersion(appVersionMin, APP_VERSION) > 0)
    return false;
  if (appVersionMax && compareVersion(appVersionMax, APP_VERSION) < 0)
    return false;
  return true;
};
