import React from 'react';
import {ActionSectionItem} from './items/ActionSectionItem';
import {Section, SectionProps} from './Section';
import {HeaderSectionItem} from './items/HeaderSectionItem';
import {InteractiveColor} from '@atb/theme/colors';

type Props<T> = Omit<SectionProps, 'children'> & {
  items: T[];
  selected?: T;
  keyExtractor(item: T, index: number): string;
  itemToText(item: T, index: number): string;
  itemToSubtext?(item: T, index: number): string | undefined;
  hideSubtext?: boolean;
  onSelect?(item: T, index: number): void;
  headerText?: string;
  color?: InteractiveColor;
};

export function RadioGroupSection<T>({
  keyExtractor,
  itemToText,
  itemToSubtext,
  hideSubtext,
  items,
  selected,
  onSelect,
  headerText,
  color,
  accessibilityHint,
  ...props
}: Props<T>) {
  return (
    <Section {...props} accessibilityRole="radiogroup">
      {headerText && <HeaderSectionItem text={headerText} mode="subheading" />}
      {items.map((item: T, index) => {
        const text = itemToText(item, index);
        const subtext = itemToSubtext ? itemToSubtext(item, index) : undefined;
        const a11yLabel = `${text}, ${hideSubtext ? '' : subtext}`;
        const checked = item === selected;
        return (
          <ActionSectionItem
            key={keyExtractor(item, index)}
            mode="check"
            checked={checked}
            text={itemToText(item, index)}
            hideSubtext={hideSubtext}
            subtext={subtext}
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
    </Section>
  );
}
