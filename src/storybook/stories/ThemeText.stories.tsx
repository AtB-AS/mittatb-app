import {textNames} from '@atb-as/theme';
import {ThemeText, ThemeTextProps} from '@atb/components/text';
import {themes} from '@atb/theme/colors';
import {Meta} from '@storybook/react';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {View} from 'react-native';

type ThemeTextMetaProps = ThemeTextProps & ThemedStoryProps;

const ThemeTextMeta: Meta<ThemeTextMetaProps> = {
  title: 'ThemeText',
  component: ThemeText,
  argTypes: {
    color: {
      control: 'select',
      options: [
        ...Object.keys(themes['light'].color.background.accent),
        ...Object.keys(themes['light'].color.background.neutral),
        ...Object.keys(themes['light'].color.status),
        ...Object.keys(themes['light'].color.foreground.dynamic),
      ],
    },
    type: {
      control: 'select',
      options: textNames,
    },
    ...themedStoryControls,
  },
  args: {
    color: themes.light.color.background.neutral[0],
    type: 'body__primary',
    isMarkdown: false,
    children: 'Hello world',
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story) => (
      <View style={{alignItems: 'center'}}>
        <Story />
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export default ThemeTextMeta;

export const Basic: Record<string, unknown> = {};
