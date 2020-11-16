import {Language} from '../utils/language';

export function translation(original: string, english?: string) {
  return {
    [Language.nb]: original,
    [Language.en]: !!english ? english : original,
  };
}
