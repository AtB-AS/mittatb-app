import {themes} from '@atb/theme/colors';
import {Meta} from '@storybook/react';
import {View} from 'react-native';
import {getCommonColorMappings, getCommonColorOptions} from './utils';

export type ThemedStoryProps<T> = {
  theme: 'light' | 'dark';
  storyColor?: string;
} & T;

export function ThemedStoryDecorator<T>(
  Story: React.ComponentType,
  {args}: {args: ThemedStoryProps<T>},
) {
  const colorMappings = getCommonColorMappings(args.theme);
  const storyContrastColor =
    colorMappings[args.storyColor ?? ''] ??
    themes[args.theme].color.background.neutral[0];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: storyContrastColor.background,
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
    options: getCommonColorOptions(),
  },
};

export const themedStoryDefaultArgs: ThemedStoryProps<{}> = {
  theme: 'light',
};
