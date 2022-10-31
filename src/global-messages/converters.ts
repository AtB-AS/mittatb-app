import {Statuses} from '@atb-as/theme';
import {LanguageAndText} from '@atb/reference-data/types';
import {isArray} from 'lodash';
import {APP_VERSION} from '@env';
import {Platform} from 'react-native';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  AppPlatformType,
  GlobalMessageContext,
  GlobalMessageRaw,
  GlobalMessageType,
} from '@atb/global-messages/types';

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
  const isDismissable = result.isDismissable;
  const appVersionMin = result.appVersionMin;
  const appVersionMax = result.appVersionMax;
  const platforms = result.appPlatform;

  if (!result.active) return;
  if (!isAppPlatformValid(platforms)) return;
  if (appVersionMin && appVersionMin > APP_VERSION) return;
  if (appVersionMax && appVersionMax < APP_VERSION) return;

  if (!body) return;
  if (!context) return;
  if (!type) return;
  if (typeof result.active !== 'boolean') return;

  return {
    id,
    type,
    active: result.active,
    context,
    body,
    title,
    isDismissable,
  };
}

function mapToMessageType(type: any) {
  const options = ['info', 'valid', 'warning', 'error'];

  if (typeof type !== 'string') return;
  if (!options.includes(type)) return;
  return type as Statuses;
}

function mapToContexts(data: any): GlobalMessageContext[] | undefined {
  if (!isArray(data)) return;

  return data
    .map((context: any) => mapToContext(context))
    .filter(Boolean) as GlobalMessageContext[];
}

function isAppPlatformValid(platforms: AppPlatformType[]) {
  if (!platforms) return true;
  return !!platforms.find((platform) => platform === Platform.OS);
}

function mapToContext(data: any): GlobalMessageContext | undefined {
  const options = [
    'app-assistant',
    'app-departures',
    'app-ticketing',
    'web-ticketing',
    'web-overview',
  ];

  if (!options.includes(data)) return;
  return data;
}

function mapToLanguageAndTexts(data: any): LanguageAndText[] | undefined {
  if (!data) return;
  if (!isArray(data)) return;

  return data
    .map((ls: any) => mapToLanguageAndText(ls))
    .filter(Boolean) as LanguageAndText[];
}

function mapToLanguageAndText(data: any): LanguageAndText | undefined {
  if (!data) return;
  if (data.lang != 'nob' && data.lang != 'eng') return;

  return {
    lang: data.lang,
    value: data.value,
  };
}
