import {initLobot, Translatable} from '@leile/lobo-t';
export enum Language {
  Norwegian = 'nb',
  English = 'en',
}
export const DEFAULT_LANGUAGE = Language.Norwegian;

export type TranslatedString = Translatable<typeof Language, string>;

export const lobot = initLobot<typeof Language>(DEFAULT_LANGUAGE);
export const useTranslation = lobot.useTranslation;
