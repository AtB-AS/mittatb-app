import {Language} from '@atb/translations/commons';
import z from 'zod';

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

export const LanguageAndTextSchema = z.union([
  z.object({
    lang: z.string(),
    value: z.string(),
  }),
  z.object({
    language: z.string().optional(),
    value: z.string().optional(),
  }),
]);

export type LanguageAndTextType = z.infer<typeof LanguageAndTextSchema>;
