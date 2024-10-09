import {TFunc} from '@leile/lobo-t';

import {initLobot, Translatable} from '@leile/lobo-t';
import {useCallback} from 'react';

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
export const useTranslation: typeof lobot.useTranslation = () => {
  const {language} = lobot.useTranslation();
  return {
    t: useCallback((arg) => arg[language], [language]),
    language: language,
  };
};

let currentStaticLanguage: Language = DEFAULT_LANGUAGE;
/**
 * tStatic can be used instead of the t function for when you don't want
 * language changes to potentially retrigger an action (such as e.g. an alert box)
 */
export const tStatic: TFunc<typeof Language> = (translatable) =>
  translatable[currentStaticLanguage];
/**
 * update language for tStatic
 */
export const setStaticLanguage = (language: Language) => {
  currentStaticLanguage = language;
};

export type TranslateFunction = TFunc<typeof Language>;
export function translation(
  norwegian: string,
  english: string,
  nynorsk: string,
): TranslatedString {
  return {
    [Language.Norwegian]: norwegian,
    [Language.English]: english,
    [Language.Nynorsk]: nynorsk,
  };
}
