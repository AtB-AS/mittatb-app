import {TFunc} from '@leile/lobo-t';

import {initLobot, Translatable} from '@leile/lobo-t';

export enum Language {
  Norwegian = 'nb',
  English = 'en',
  Nynorsk = 'nn',
}
export const appLanguages = ['nb', 'en', 'nn'] as const;

export const DEFAULT_LANGUAGE = Language.Norwegian;
export const FALLBACK_LANGUAGE = Language.English;
export const DEFAULT_REGION = 'NO';
export type TranslatedString = Translatable<typeof Language, string>;

export const lobot = initLobot<typeof Language>(DEFAULT_LANGUAGE);
export const useTranslation = lobot.useTranslation;

export type TranslateFunction = TFunc<typeof Language>;
export function translation(
  norwegian: string,
  english: string,
  nynorsk: string,
): TranslatedString {
  return {
    [Language.Norwegian]: norwegian,
    [Language.English]: english,
    [Language.Nynorsk]: nynorsk === '§' ? norwegian : nynorsk,
  };
}
