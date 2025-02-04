import {Meta} from '@storybook/react';
import {View} from 'react-native';
import {getColorByOption, getColorOptions} from './utils';

export type ThemedStoryProps<T> = {
  theme: 'light' | 'dark';
  storyColor?: string;
} & T;

export function ThemedStoryDecorator<T>(
  Story: React.ComponentType,
  {args}: {args: ThemedStoryProps<T>},
) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: getColorByOption(args.theme, args.storyColor)
          .background,
      }}
    >
      <Story />
    </View>
  );
}

export const themedStoryControls: Meta['argTypes'] = {
  theme: {
    control: {type: 'radio'},
    options: ['light', 'dark'],
  },
  storyColor: {
    control: 'select',
    options: getColorOptions(),
  },
};

export const themedStoryDefaultArgs: ThemedStoryProps<{}> = {
  theme: 'light',
};
