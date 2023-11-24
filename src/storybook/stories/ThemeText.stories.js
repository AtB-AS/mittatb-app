import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {getStaticColor, themes} from '@atb/theme/colors';
import {textNames} from '@atb-as/theme';

const ThemeTextMeta = {
  title: 'ThemeText',
  component: ThemeText,
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
    color: {
      control: 'select',
      options: [
        ...Object.keys(themes['light'].static.background),
        ...Object.keys(themes['light'].static.status),
        ...Object.keys(themes['light'].text.colors),
      ],
    },
    backgroundColor: {
      control: 'select',
      description: 'Will fallback to color',
      options: [
        ...Object.keys(themes['light'].static.background),
        ...Object.keys(themes['light'].static.status),
      ],
    },
    type: {
      control: 'select',
      options: textNames,
    },
  },
  args: {
    color: 'background_0',
    type: 'body__primary',
    theme: 'light',
    isMarkdown: false,
    children: 'Hello world',
  },
  decorators: [
    (Story, {args}) => (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor:
            getStaticColor(args.theme, args.backgroundColor || args.color)
              ?.background ||
            getStaticColor(args.theme, 'background_0').background,
        }}
      >
        <Story />
      </View>
    ),
  ],
};

export default ThemeTextMeta;

export const Basic = {};
