import {Language, useTranslation} from './commons';
import {LanguageAndTextLanguagesEnum, LanguageAndTextType} from './types';

/**
 * Get the text in the requested language. If the requested translation isn't
 * found, it will fall back to Bokmål/Norwegian. If no known translation is
 * found, the first text in the provided texts array is returned.
 */
export const getTextForLanguage = (
  texts: LanguageAndTextType[] | undefined,
  language: Language,
): string | undefined => {
  if (language === Language.English) {
    const englishText = texts?.find(
      (t) =>
        getLanguage(t) === LanguageAndTextLanguagesEnum.eng ||
        getLanguage(t) === LanguageAndTextLanguagesEnum.en,
    );
    if (englishText?.value) return englishText.value;
  }
  if (language === Language.Nynorsk) {
    const nynorskText = texts?.find(
      (t) =>
        getLanguage(t) === LanguageAndTextLanguagesEnum.nno ||
        getLanguage(t) === LanguageAndTextLanguagesEnum.nn,
    );
    if (nynorskText?.value) return nynorskText.value;
  }
  const norwegianText = texts?.find(
    (t) =>
      getLanguage(t) === LanguageAndTextLanguagesEnum.nor ||
      getLanguage(t) === LanguageAndTextLanguagesEnum.nob ||
      getLanguage(t) === LanguageAndTextLanguagesEnum.no,
  );
  if (norwegianText?.value) return norwegianText.value;

  return texts?.[0]?.value;
};

/**
 * Removes any escape characters for markdown text on Firestore 
 */
export const getUnescapedTextForLanguage = (
  texts: LanguageAndTextType[] | undefined,
  language: Language,
): string | undefined => {
  return getTextForLanguage(texts, language)?.replace(/\\n/g, '\n');
}

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
