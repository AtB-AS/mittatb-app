import {ThemeText} from '@atb/components/text';
import {useTheme} from '@atb/theme';
import {ContrastColor, themes} from '@atb/theme/colors';
import {Meta} from '@storybook/react';
import {View, ViewStyle} from 'react-native';

export type ThemedStoryProps<T> = {
  theme: 'light' | 'dark';
  backgroundColor?: ContrastColor;
} & T;

export function ThemedStoryDecorator<T>(
  Story: React.ComponentType,
  {args}: {args: ThemedStoryProps<T>},
) {
  const {theme} = useTheme();
  return (
    <View
      style={
        {
          justifyContent: 'center',
          flex: 1,
          backgroundColor:
            args.backgroundColor?.background ||
            theme.color.background.neutral[0].background,
        } as ViewStyle
      }
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
