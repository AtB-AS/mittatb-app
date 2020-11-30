import React from 'react';
import ActionItem from './action-item';
import SectionGroup, {SectionProps} from './section';

export type RadioSectionProps<T> = Omit<SectionProps, 'type' | 'children'> & {
  items: T[];
  selected?: T;
  keyExtractor(item: T, index: number): string;
  itemToText(item: T, index: number): string;
  onSelect?(item: T, index: number): void;
};

export default function RadioSectionGroup<T>({
  keyExtractor,
  itemToText,
  items,
  selected,
  onSelect,
  ...props
}: RadioSectionProps<T>) {
  return (
    <SectionGroup {...props}>
      {items.map((item: T, index) => (
        <ActionItem
          key={keyExtractor(item, index)}
          mode="check"
          checked={item == selected}
          text={itemToText(item, index)}
          onPress={() => onSelect?.(item, index)}
        />
      ))}
    </SectionGroup>
  );
}
