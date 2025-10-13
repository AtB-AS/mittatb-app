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
