import {Language} from '../utils/language';

export function translation(original: string, english?: string) {
  return {
    [Language.Norwegian]: original,
    [Language.English]: !!english ? english : original,
  };
}
