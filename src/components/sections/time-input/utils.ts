import {Language} from '@atb/translations';
import {formatLocaleTime} from '@atb/utils/date';
import {SectionItem} from '../section-utils';

export type TimeInputItemProps = SectionItem<{
  value: string;
  onChange(time: string): void;
}>;

export function dateToTimeString(
  date: Date | string | undefined,
  language: Language,
) {
  return formatLocaleTime(date ?? new Date(), language);
}
