import {Language} from '../utils/language';

export function translateable(original: string, english?: string) {
  return {
    [Language.nb]: original,
    [Language.en]: !!english ? english : original,
  };
}
