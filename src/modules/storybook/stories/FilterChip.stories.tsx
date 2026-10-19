import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FilterChip} from '@atb/components/filter-chip';
import {Filter} from '@atb/assets/svg/mono-icons/actions';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react';

type FilterChipProps = React.ComponentProps<typeof FilterChip>;

type FilterChipMetaProps = ThemedStoryProps<FilterChipProps>;

const FilterChipMeta: Meta<FilterChipMetaProps> = {
  title: 'FilterChip',
  component: FilterChip,
  argTypes: {
    ...themedStoryControls,
  },
  args: {
    onPress: () => {},
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => (
      <View style={styles.container}>
        <View style={styles.row}>
          <Story args={{...args, text: 'Not selected', selected: false}} />
          <Story args={{...args, text: 'Selected', selected: true}} />
          <Story
            args={{
              ...args,
              text: 'Icon',
              selected: true,
              rightIcon: {svg: Filter},
            }}
          />
        </View>
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export default FilterChipMeta;

export const Default = {};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 12,
    flex: 1,
    rowGap: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: 8,
  },
});
