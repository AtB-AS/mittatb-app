import {textNames} from '@atb-as/theme';
import {ThemeText, ThemeTextProps} from '@atb/components/text';
import {Meta} from '@storybook/react';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {View} from 'react-native';
import {getColorByOption} from '../utils';

type ThemeTextMetaProps = ThemedStoryProps<ThemeTextProps>;

const ThemeTextMeta: Meta<ThemeTextMetaProps> = {
  title: 'ThemeText',
  component: ThemeText,
  argTypes: {
    typography: {
      control: 'select',
      options: textNames,
    },
    ...themedStoryControls,
  },
  args: {
    typography: 'body__primary',
    isMarkdown: false,
    children: 'Hello world',
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => (
      <View style={{alignItems: 'center'}}>
        <Story
          args={{...args, color: getColorByOption(args.theme, args.storyColor)}}
        />
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export default ThemeTextMeta;

export const Basic: Record<string, unknown> = {};
