import {LanguageAndTextType} from '@atb/translations';

export type TipRaw = {
  id: string;
  title: string;
  description: string;
  emoji: string;
};
export type TipType = {
  id: string;
  title: LanguageAndTextType[];
  description: LanguageAndTextType[];
  emoji: string;
};
