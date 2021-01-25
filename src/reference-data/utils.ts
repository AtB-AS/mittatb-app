import {LanguageAndText} from './types';
import {Language} from '../translations';

/**
 * Get the text of a field in a NeTeX entity in the correct language. If English
 * is requested, it will fallback to Norwegian if no English text is found. If
 * neither English nor Norwegian is found the first text in the provided texts
 * array is returned.
 */
const getReferenceDataText = (texts: LanguageAndText[], language: Language) => {
  if (language === Language.English) {
    const englishText = texts.find((t) => t.lang === 'eng');
    if (englishText) return englishText.value;
  }
  const norwegianText = texts.find((t) => t.lang === 'nor' || t.lang === 'nob');
  if (norwegianText) return norwegianText.value;

  return texts[0].value;
};

/**
 * Wrapper for getting the name of a NeTeX entity in the given language.
 */
export const getReferenceDataName = <
  T extends {
    name: LanguageAndText;
    alternativeNames?: LanguageAndText[];
  }
>(
  {name, alternativeNames}: T,
  language: Language,
) => getReferenceDataText([name, ...(alternativeNames || [])], language);
