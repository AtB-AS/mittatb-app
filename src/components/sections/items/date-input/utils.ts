import {SectionItemProps} from '../../types';

export type DateInputSectionItemProps = SectionItemProps<{
  value: string;
  onChange(time: string): void;
}>;

export function dateToDateString(date: Date | undefined) {
  return (date ?? new Date()).toISOString();
}
