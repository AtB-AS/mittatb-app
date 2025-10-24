import {Language, useTranslation} from './commons';
import {
  LanguageAndTextLanguagesEnum,
  LanguageAndTextType,
  LanguageKeyVariants,
} from './types';

/**
 * Get the text in the requested language. If the requested translation isn't
 * found, it will fall back to Bokmål/Norwegian. If no known translation is
 * found, the first text in the provided texts array is returned.
 */
export const getTextForLanguage = (
  texts: LanguageAndTextType[] | undefined,
  language: Language,
): string | undefined => {
  if (!texts?.length) return undefined;

  const findTextInLanguage = (language: Language) =>
    texts?.find((t) => {
      const lang = getLanguage(t);
      return lang && LanguageKeyVariants[language].includes(lang);
    })?.value;

  return (
    findTextInLanguage(language) ??
    findTextInLanguage(Language.Norwegian) ??
    texts[0].value
  );
};

/**
 * Get the text in the current language. If English is requested, it will
 * fall back to Norwegian if no English text is found. If neither English nor
 * Norwegian is found the first text in the provided texts array is returned.
 */
export const useTextForLanguage = (
  texts?: LanguageAndTextType[] | undefined,
): string | undefined => {
  const {language} = useTranslation();
  return getTextForLanguage(texts, language);
};

export const getLanguageAndTextEnum = (language: Language) => {
  switch (language) {
    case Language.English:
      return LanguageAndTextLanguagesEnum.eng;
    case Language.Norwegian:
      return LanguageAndTextLanguagesEnum.nob;
    case Language.Nynorsk:
      return LanguageAndTextLanguagesEnum.nno;
  }
};

const getLanguage = (lv: LanguageAndTextType) =>
  'lang' in lv ? lv.lang : lv.language;
