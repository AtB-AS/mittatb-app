import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { AnnouncementRaw, AnnouncementType, OpenUrl } from './types';
import { mapToLanguageAndTexts } from '@atb/utils/map-to-language-and-texts';
import { APP_VERSION } from '@env';
import { AppPlatformType } from '@atb/global-messages/types';
import { Platform } from 'react-native';
import { mapToRules } from '@atb/rule-engine';

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
  const appVersionMin = result.appVersionMin;
  const appVersionMax = result.appVersionMax;
  const platforms = result.appPlatforms;
  const startDate = mapToMillis(result.startDate);
  const endDate = mapToMillis(result.endDate);
  const rules = mapToRules(result.rules);
  const openUrl = mapToOpenUrl(result.openUrl);

  if (!result.active) return;
  if (!summary) return;
  if (!fullTitle) return;
  if (!body) return;
  if (!isAppPlatformValid(platforms)) return;
  if (appVersionMin && appVersionMin > APP_VERSION) return;
  if (appVersionMax && appVersionMax < APP_VERSION) return;

  return {
    id,
    active: result.active,
    summaryTitle,
    summary,
    summaryImage,
    fullTitle,
    body,
    mainImage,
    isDismissable,
    startDate,
    endDate,
    rules,
    openUrl,
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

function isAppPlatformValid(platforms: AppPlatformType[]) {
  if (!platforms) return true;
  return !!platforms.find(
    (platform) => platform.toLowerCase() === Platform.OS.toLowerCase(),
  );
}

function mapToOpenUrl(data: any): OpenUrl | undefined {
  if (typeof data !== 'object') return;
  const { title, link, linkType } = data;
  if (!title || !link || !linkType) return;
  if (!['external', 'deeplink'].includes(linkType)) return;
  const titleWithLanguage = mapToLanguageAndTexts(title);
  if (!titleWithLanguage) return;
  return {
    title: titleWithLanguage,
    link,
    linkType,
  }
}
