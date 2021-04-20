import {TFunc} from '@leile/lobo-t';

import {initLobot, Translatable} from '@leile/lobo-t';

export enum Language {
  Norwegian = 'nb',
  English = 'en',
}
export const appLanguages = ['nb', 'en'] as const;

export const DEFAULT_LANGUAGE = Language.Norwegian;
export type TranslatedString = Translatable<typeof Language, string>;

export const lobot = initLobot<typeof Language>(DEFAULT_LANGUAGE);
export const useTranslation = () => {
  const {t, language} = lobot.useTranslation();
  return {t, language, locale: languageToLocale(language)};
};

export type TranslateFunction = TFunc<typeof Language>;
export function translation(
  norwegian: string,
  english: string,
): TranslatedString {
  return {
    [Language.Norwegian]: norwegian,
    [Language.English]: english,
  };
}
export function languageToLocale(language: Language) {
  switch (language) {
    case Language.Norwegian:
      return 'no';
    case Language.English:
      return Language.English;
  }
}
