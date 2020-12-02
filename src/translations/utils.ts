import {Language, TranslatedString} from '../utils/language';
import {TFunc} from '@leile/lobo-t';

export function translation(
  norwegian: string,
  english?: string,
): TranslatedString {
  return {
    [Language.Norwegian]: norwegian,
    [Language.English]: !!english ? english : norwegian,
  };
}

export type TranslateFunction = TFunc<typeof Language>;
