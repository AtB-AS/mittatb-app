import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {AppPlatform} from '@atb/modules/global-messages';
import {Platform} from 'react-native';
import {APP_VERSION} from '@env';
import {Announcement, OldAnnouncementToNewTransformer} from './types';
import {Announcement as OldAnnouncement} from './deprecated-types';
import {isDefined} from '@atb/utils/presence';
import {compareVersion} from '@atb/utils/compare-version';
import {SafeParseReturnType} from 'node_modules/zod/lib/types';

export const mapToAnnouncements = (
  snapshots: FirebaseFirestoreTypes.QueryDocumentSnapshot[],
): Announcement[] => {
  if (!Array.isArray(snapshots)) return [];

  const announcements = snapshots
    .map((snapshot) => mapToAnnouncement(snapshot))
    .filter(isDefined);

  const applicableAnnouncements = announcements.filter(
    (announcement) =>
      announcement.config.active &&
      appliesToAppPlaform(announcement.config.appPlatforms) &&
      appliesToAppVersion(
        announcement.config.appVersionMin,
        announcement.config.appVersionMax,
      ),
  );
  return applicableAnnouncements;
};

export const mapToAnnouncement = (
  snapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot,
): Announcement | undefined => {
  const data = snapshot.data();
  const oldParseResult = parseOldAnnouncementToNew(snapshot);
  if (oldParseResult.success) {
    return oldParseResult.data;
  }

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

const parseOldAnnouncementToNew = (
  snapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot,
): SafeParseReturnType<any, Announcement> => {
  const data = snapshot.data();
  const parseResult = OldAnnouncement.safeParse({
    ...data,
    id: snapshot.id,
  });

  if (parseResult.success) {
    // Transform the old announcement to the new format using Zod transformer
    return OldAnnouncementToNewTransformer.safeParse(parseResult.data);
  }

  return parseResult;
};

const appliesToAppPlaform = (platforms?: AppPlatform[]) => {
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
