export enum LanguageAndTextLanguagesEnum {
  'nob' = 'nob',
  'nno' = 'nno',
  'nor' = 'nor',
  'no' = 'no',
  'eng' = 'eng',
  'en' = 'en',
}

export type LanguageAndTextType =
  | {
      lang: string;
      value: string;
    }
  | {language?: string; value?: string};
