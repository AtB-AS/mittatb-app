import {SectionItemProps} from '../../types';

export type DateInputSectionItemProps = SectionItemProps<{
  value: string;
  onChange(time: string): void;
}>;
