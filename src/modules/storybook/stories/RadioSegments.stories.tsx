import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RadioSegments} from '@atb/components/radio';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react';

type RadioSegmentsProps = React.ComponentProps<typeof RadioSegments>;

type RadioSegmentsMetaProps = ThemedStoryProps<RadioSegmentsProps>;

const createOptions = (count: number) =>
  Array.from({length: count}, (_, i) => ({
    text: `Option ${i + 1}`,
    onPress: () => {},
  }));

const RadioSegmentsMeta: Meta<RadioSegmentsMetaProps> = {
  title: 'RadioSegments',
  component: RadioSegments,
  argTypes: {
    ...themedStoryControls,
  },
  args: {
    activeIndex: 0,
    ...themedStoryDefaultArgs,
    storyColor: 'background neutral 2',
  },
  decorators: [
    (Story, {args}) => (
      <View style={styles.container}>
        <Story args={{...args, options: createOptions(2)}} />
        <Story args={{...args, activeIndex: 1, options: createOptions(3)}} />
        <Story args={{...args, activeIndex: 3, options: createOptions(4)}} />
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export default RadioSegmentsMeta;

export const Default = {};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    padding: 12,
    flex: 1,
    rowGap: 12,
  },
});
