import React from 'react';
import ActionItem from './action-item';
import SectionGroup, {SectionProps} from './section';
import {HeaderItem} from '@atb/components/sections/index';
import {InteractiveColor} from '@atb/theme/colors';

export type RadioSectionProps<T> = Omit<SectionProps, 'children'> & {
  items: T[];
  selected?: T;
  keyExtractor(item: T, index: number): string;
  itemToText(item: T, index: number): string;
  itemToSubtext?(item: T, index: number): string;
  onSelect?(item: T, index: number): void;
  headerText?: string;
  color?: InteractiveColor;
};

export default function RadioSectionGroup<T>({
  keyExtractor,
  itemToText,
  itemToSubtext,
  items,
  selected,
  onSelect,
  headerText,
  color,
  ...props
}: RadioSectionProps<T>) {
  return (
    <SectionGroup {...props} accessibilityRole="radiogroup">
      {headerText && <HeaderItem text={headerText} mode="subheading" />}
      {items.map((item: T, index) => (
        <ActionItem
          key={keyExtractor(item, index)}
          mode="check"
          checked={item == selected}
          text={itemToText(item, index)}
          subtext={itemToSubtext ? itemToSubtext(item, index) : undefined}
          onPress={() => onSelect?.(item, index)}
          testID={'radioButton' + itemToText(item, index)}
          color={color}
        />
      ))}
    </SectionGroup>
  );
}
