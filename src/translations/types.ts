import {Language} from '@atb/translations/commons';

export enum LanguageAndTextLanguagesEnum {
  'nob' = 'nob',
  'nno' = 'nno',
  'nn' = 'nn',
  'nor' = 'nor',
  'no' = 'no',
  'eng' = 'eng',
  'en' = 'en',
}

/**
 * Several keys exist for languages (e.g., 'nob', 'nor', 'no' for Norwegian Bokmål).
 * This mapping helps to find all variants for a given Language enum.
 */
export const LanguageKeyVariants: Record<Language, string[]> = {
  [Language.English]: [
    LanguageAndTextLanguagesEnum.eng,
    LanguageAndTextLanguagesEnum.en,
  ],
  [Language.Nynorsk]: [
    LanguageAndTextLanguagesEnum.nno,
    LanguageAndTextLanguagesEnum.nn,
  ],
  [Language.Norwegian]: [
    LanguageAndTextLanguagesEnum.nor,
    LanguageAndTextLanguagesEnum.nob,
    LanguageAndTextLanguagesEnum.no,
  ],
};

export type LanguageAndTextType =
  | {
      lang: string;
      value: string;
    }
  | {language?: string; value?: string};
