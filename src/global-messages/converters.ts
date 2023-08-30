import {Statuses} from '@atb-as/theme';
import {isArray} from 'lodash';
import {APP_VERSION} from '@env';
import {Platform} from 'react-native';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  AppPlatformType,
  GlobalMessageContextEnum,
  GlobalMessageRaw,
  GlobalMessageType,
} from '@atb/global-messages/types';
import {mapToLanguageAndTexts} from '@atb/utils/map-to-language-and-texts';
import {Rule, RuleOperator} from './rules';
export function mapToGlobalMessages(
  result: FirebaseFirestoreTypes.QueryDocumentSnapshot<GlobalMessageRaw>[],
): GlobalMessageType[] {
  if (!result) return [];

  return result
    .map((message) => mapToGlobalMessage(message.id, message.data()))
    .filter((gm): gm is GlobalMessageType => !!gm);
}

function mapToGlobalMessage(
  id: string,
  result: GlobalMessageRaw,
): GlobalMessageType | undefined {
  if (!result) return;

  const body = mapToLanguageAndTexts(result.body);
  const title = mapToLanguageAndTexts(result.title);
  const context = mapToContexts(result.context);
  const type = mapToMessageType(result.type);
  const subtle = result.subtle;
  const isDismissable = result.isDismissable;
  const appVersionMin = result.appVersionMin;
  const appVersionMax = result.appVersionMax;
  const platforms = result.appPlatforms;
  const startDate = mapToMillis(result.startDate);
  const endDate = mapToMillis(result.endDate);
  const rules = mapToRules(result.rules);

  if (!result.active) return;
  if (!isAppPlatformValid(platforms)) return;
  if (appVersionMin && appVersionMin > APP_VERSION) return;
  if (appVersionMax && appVersionMax < APP_VERSION) return;

  if (!body) return;
  if (!context) return;
  if (!type) return;

  return {
    id,
    type,
    subtle,
    active: result.active,
    context,
    body,
    title,
    isDismissable,
    startDate,
    endDate,
    rules,
  };
}

function mapToMessageType(type: any) {
  const options = ['info', 'valid', 'warning', 'error'];

  if (typeof type !== 'string') return;
  if (!options.includes(type)) return;
  return type as Statuses;
}

function mapToMillis(
  timestamp?: FirebaseFirestoreTypes.Timestamp,
): number | undefined {
  if (!timestamp) return;
  if (typeof timestamp !== 'object') return;
  if (!timestamp.toMillis) return;
  return timestamp.toMillis();
}

function mapToContexts(data: any): GlobalMessageContextEnum[] | undefined {
  if (!isArray(data)) return;

  return data
    .map((context: any) => mapToContext(context))
    .filter(Boolean) as GlobalMessageContextEnum[];
}

function isAppPlatformValid(platforms: AppPlatformType[]) {
  if (!platforms) return true;
  return !!platforms.find(
    (platform) => platform.toLowerCase() === Platform.OS.toLowerCase(),
  );
}

function mapToContext(data: any): GlobalMessageContextEnum | undefined {
  if (!Object.values(GlobalMessageContextEnum).includes(data)) return;
  return data as GlobalMessageContextEnum;
}

function mapToRules(data: any): Rule[] {
  if (!isArray(data)) return [];
  return data.map((rule: any) => mapToRule(rule)).filter(Boolean) as Rule[];
}

function mapToRule(data: any): Rule | undefined {
  if (typeof data !== 'object') return;

  const {variable, operator, value, groupId} = data;
  if (typeof variable !== 'string') return;
  if (!(operator in RuleOperator)) return;
  if (
    !(['string', 'number', 'boolean'].includes(typeof value) || value === null)
  )
    return;
  if (groupId !== undefined && typeof groupId !== 'string') return;

  return {variable, operator, value, groupId};
}
