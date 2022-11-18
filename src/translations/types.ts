export enum LanguageAndTextLanguagesEnum {
  'nob' = 'nob',
  'nno' = 'nno',
  'nor' = 'nor',
  'eng' = 'eng',
}

export type LanguageAndTextType =
  | {
      lang: string;
      value: string;
    }
  | {language?: string; value?: string};
