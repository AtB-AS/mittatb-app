import {Language} from '@atb/translations';
import {formatLocaleTime} from '@atb/utils/date';
import {SectionItemProps} from '../../types';

export type TimeInputSectionItemProps = SectionItemProps<{
  value: string;
  onChange(time: string): void;
}>;

export function dateToTimeString(
  date: Date | string | undefined,
  language: Language,
) {
  return formatLocaleTime(date ?? new Date(), language);
}
