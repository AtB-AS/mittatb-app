import {
  LanguageAndText,
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from './types';
import {Language} from '../translations/commons';

enum ReferenceDataLanguage {
  'nob' = 'nob',
  'nno' = 'nno',
  'nor' = 'nor',
  'eng' = 'eng',
}

/**
 * Get the text of a field in a NeTeX entity in the correct language. If English
 * is requested, it will fallback to Norwegian if no English text is found. If
 * neither English nor Norwegian is found the first text in the provided texts
 * array is returned.
 */
export const getReferenceDataText = (
  texts: LanguageAndText[],
  language: Language,
) => {
  if (language === Language.English) {
    const englishText = texts.find((t) => t.lang === ReferenceDataLanguage.eng);
    if (englishText) return englishText.value;
  }
  const norwegianText = texts.find(
    (t) =>
      t.lang === ReferenceDataLanguage.nor ||
      t.lang === ReferenceDataLanguage.nob,
  );
  if (norwegianText) return norwegianText.value;

  return texts[0]?.value;
};

/**
 * Wrapper for getting the name of a NeTeX entity in the given language.
 */
export const getReferenceDataName = <
  T extends {
    name: LanguageAndText;
    alternativeNames?: LanguageAndText[];
  },
>(
  {name, alternativeNames}: T,
  language: Language,
) => getReferenceDataText([name, ...(alternativeNames || [])], language);

export const findReferenceDataById = <
  T extends UserProfile | PreassignedFareProduct | TariffZone,
>(
  elements: T[],
  id: string,
) => elements.find((p) => p.id === id);

export const productIsSellableInApp = (product: PreassignedFareProduct) => {
  return product.distributionChannel.some((channel) => channel === 'app');
};
