import {SectionItem} from '../section-utils';

export type DateInputItemProps = SectionItem<{
  value: string;
  onChange(time: string): void;
}>;

export function dateToDateString(date: Date | undefined) {
  return (date ?? new Date()).toISOString();
}
