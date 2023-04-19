import {Language, useTranslation} from './commons';
import {LanguageAndTextLanguagesEnum, LanguageAndTextType} from './types';

/**
 * Get the text in the requested language. If English is requested, it will
 * fall back to Norwegian if no English text is found. If neither English nor
 * Norwegian is found the first text in the provided texts array is returned.
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
  const norwegianText = texts?.find(
    (t) =>
      getLanguage(t) === LanguageAndTextLanguagesEnum.nor ||
      getLanguage(t) === LanguageAndTextLanguagesEnum.nob ||
      getLanguage(t) === LanguageAndTextLanguagesEnum.no,
  );
  if (norwegianText?.value) return norwegianText.value;

  return texts?.[0]?.value;
};

export function getTextForLanguageWithFormat(
  texts: LanguageAndTextType[] | undefined,
  language: Language,
  ...values: string[]
) {
  var text = getTextForLanguage(texts, language);

  if (!text) {
    return undefined;
  }

  for (let index = 0; index < values.length; index++) {
    text = text.replace(`{${index}}`, values[index]);
  }

  return text;
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

const getLanguage = (lv: LanguageAndTextType) =>
  'lang' in lv ? lv.lang : lv.language;
