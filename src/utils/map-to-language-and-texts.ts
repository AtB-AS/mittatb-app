import {LanguageAndTextType} from '@atb/translations';
import {isArray} from 'lodash';

export function mapToLanguageAndTexts(
  data: any,
): LanguageAndTextType[] | undefined {
  if (!data) return;
  if (!isArray(data)) return;

  return data
    .map((ls: any) => mapToLanguageAndText(ls))
    .filter((lv): lv is LanguageAndTextType => !!lv);
}

function mapToLanguageAndText(data: any): LanguageAndTextType | undefined {
  if (!data) return;
  if (data.lang != 'nob' && data.lang != 'eng') return;

  return {
    lang: data.lang,
    value: data.value,
  };
}
