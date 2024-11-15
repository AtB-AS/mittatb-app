import { useTheme } from '@atb/theme';
import {ContrastColor, themes} from '@atb/theme/colors';
import {Meta} from '@storybook/react';
import {View, ViewStyle} from 'react-native';

export type ThemedStoryProps = {
  theme: 'light' | 'dark';
  backgroundColor?: ContrastColor;
};

export const ThemedStoryDecorator = (
  Story: React.ComponentType,
  {args}: {args: any},
) => {
  const {theme} = useTheme();
  return (
    <View
      style={
        {
          justifyContent: 'center',
          flex: 1,
          backgroundColor: args.backgroundColor.background || theme.color.background.neutral[0].background
        } as ViewStyle
      }
    >
      <Story />
    </View>
  );
};

export const themedStoryControls: Meta['argTypes'] = {
  theme: {
    control: {type: 'radio'},
    options: ['light', 'dark'],
  },
  backgroundColor: {
    control: 'select',
    options: [
      ...Object.keys(themes['light'].color.background.neutral[0]),
      ...Object.keys(themes['light'].color.background.accent[0]),
      ...Object.keys(themes['light'].color.status),
    ],
  },
};

export const themedStoryDefaultArgs: ThemedStoryProps = {
  theme: 'light',
};
