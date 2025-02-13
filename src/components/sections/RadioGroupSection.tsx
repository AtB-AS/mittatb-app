import React from 'react';
import {RadioSectionItem} from './items/RadioSectionItem.tsx';
import {Section, SectionProps} from './Section';
import {HeaderSectionItem} from './items/HeaderSectionItem';

type Props<T> = Omit<SectionProps, 'children'> & {
  items: T[];
  selected?: T;
  keyExtractor(item: T, index: number): string;
  itemToText(item: T, index: number): string;
  itemToSubtext?(item: T, index: number): string | undefined;
  itemToA11yLabel?(item: T): string | undefined;
  hideSubtext?: boolean;
  onSelect?(item: T, index: number): void;
  headerText?: string;
  itemToRightAction?: (
    item: T,
  ) => React.ComponentProps<typeof RadioSectionItem>['rightAction'];
};

export function RadioGroupSection<T>({
  keyExtractor,
  itemToText,
  itemToSubtext,
  itemToA11yLabel,
  hideSubtext,
  items,
  selected,
  onSelect,
  headerText,
  accessibilityHint,
  itemToRightAction,
  ...props
}: Props<T>) {
  return (
    <Section {...props} accessibilityRole="radiogroup">
      {headerText && <HeaderSectionItem text={headerText} mode="subheading" />}
      {items.map((item: T, index) => {
        const thisItemSelected =
          !!selected &&
          keyExtractor(item, index) === keyExtractor(selected, index);
        return (
          <RadioSectionItem
            key={keyExtractor(item, index)}
            selected={thisItemSelected}
            text={itemToText(item, index)}
            hideSubtext={hideSubtext}
            subtext={itemToSubtext?.(item, index) || ''}
            onPress={() => onSelect?.(item, index)}
            testID={'radioButton' + itemToText(item, index)}
            accessibilityHint={thisItemSelected ? '' : accessibilityHint}
            accessibilityLabel={itemToA11yLabel?.(item)}
            rightAction={itemToRightAction?.(item)}
          />
        );
      })}
    </Section>
  );
}
