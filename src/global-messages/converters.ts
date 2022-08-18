import {LanguageAndText} from '@atb/reference-data/types';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {isArray} from 'lodash';
import {GlobalMessage, GlobalMessageContext} from './GlobalMessagesContext';

export function mapToGlobalMessages(
  result: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[],
): GlobalMessage[] {
  if (!result) return [];

  return result
    .map((message) => mapToGlobalMessage(message.id, message.data()))
    .filter(Boolean) as GlobalMessage[];
}

function mapToGlobalMessage(
  id: string,
  result: any,
): GlobalMessage | undefined {
  if (!result) return;

  const body = mapToLanguageAndTexts(result.body);
  const title = mapToLanguageAndTexts(result.title);
  const context = mapToContexts(result.context);

  if (!result.active) return;
  if (!body) return;
  if (!context) return;

  return {
    id,
    type: result.type ?? 'info',
    active: result.active,
    context,
    body,
    title,
  };
}

function mapToContexts(data: any): GlobalMessageContext[] | undefined {
  if (!isArray(data)) return;

  return data
    .map((context: any) => mapToContext(context))
    .filter(Boolean) as GlobalMessageContext[];
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
