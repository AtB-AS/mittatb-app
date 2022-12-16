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
  itemToWarningText?(item: T, index: number): string | undefined;
  hideSubtext?: boolean;
  onSelect?(item: T, index: number): void;
  headerText?: string;
  color?: InteractiveColor;
};

export default function RadioSectionGroup<T>({
  keyExtractor,
  itemToText,
  itemToSubtext,
  itemToWarningText,
  hideSubtext,
  items,
  selected,
  onSelect,
  headerText,
  color,
  accessibilityHint,
  ...props
}: RadioSectionProps<T>) {
  return (
    <SectionGroup {...props} accessibilityRole="radiogroup">
      {headerText && <HeaderItem text={headerText} mode="subheading" />}
      {items.map((item: T, index) => {
        const text = itemToText(item, index);
        const subtext = itemToSubtext ? itemToSubtext(item, index) : undefined;
        const warningText = itemToWarningText
          ? itemToWarningText(item, index)
          : undefined;
        const a11yLabel = `${text}, ${hideSubtext ? '' : subtext}`;
        const checked = item === selected;
        return (
          <ActionItem
            key={keyExtractor(item, index)}
            mode="check"
            checked={checked}
            text={itemToText(item, index)}
            hideSubtext={hideSubtext}
            subtext={subtext}
            warningText={warningText}
            onPress={() => onSelect?.(item, index)}
            testID={'radioButton' + itemToText(item, index)}
            color={color}
            accessibility={{
              accessibilityHint: checked ? '' : accessibilityHint,
              accessibilityLabel: a11yLabel,
            }}
          />
        );
      })}
    </SectionGroup>
  );
}
