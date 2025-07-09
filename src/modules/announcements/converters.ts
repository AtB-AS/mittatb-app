import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  AnnouncementRaw,
  AnnouncementType,
  ActionButton,
  ActionType,
  AnnouncementRawSchema,
} from './types';
import {mapToLanguageAndTexts} from '@atb/utils/map-to-language-and-texts';
import {APP_VERSION} from '@env';
import {AppPlatform} from '@atb/modules/global-messages';
import {Platform} from 'react-native';
import {mapToRules} from '@atb/modules/rule-engine';

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

  const parseResult = AnnouncementRawSchema.safeParse(result);
  if (!parseResult.success) return;

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
  const actionButton = mapActionButton(result.actionButton);

  if (!summary) return;
  if (!fullTitle) return;
  if (!body) return;
  if (!isAppPlatformValid(platforms)) return;
  if (appVersionMin && appVersionMin > APP_VERSION) return;
  if (appVersionMax && appVersionMax < APP_VERSION) return;
  if (!actionButton) return;

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
    actionButton,
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

function isAppPlatformValid(platforms: AppPlatform[]) {
  if (!platforms) return true;
  return !!platforms.find(
    (platform) => platform.toLowerCase() === Platform.OS.toLowerCase(),
  );
}

function mapActionButton(data: any): ActionButton | undefined {
  const action = data ?? {};
  const labelWithLanguage = mapToLanguageAndTexts(action.label);
  const url = action.url;
  const actionType = mapToActionType(action.actionType);

  if (!actionType) return;

  return {
    label: labelWithLanguage,
    url,
    actionType,
  };
}

function mapToActionType(data: any): ActionType | undefined {
  if (Object.values(ActionType).includes(data)) return data;
}
