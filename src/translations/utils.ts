import {Language} from '../utils/language';
import {TFunc} from '@leile/lobo-t';

export function translation(original: string, english?: string) {
  return {
    [Language.Norwegian]: original,
    [Language.English]: !!english ? english : original,
  };
}
export type TranslateFunction = TFunc<typeof Language>;
