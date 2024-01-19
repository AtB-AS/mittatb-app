import React from 'react';
import {View} from 'react-native';
import {getStaticColor, themes} from '@atb/theme/colors';
import {Button} from '@atb/components/button';
import {Add} from '@atb/assets/svg/mono-icons/actions';

const ButtonMeta = {
  title: 'Button',
  component: Button,
  argTypes: {
    theme: {
      control: {type: 'radio'},
      options: ['light', 'dark'],
    },
    interactiveColor: {
      control: 'select',
      options: [...Object.keys(themes['light'].interactive)],
    },
    backgroundColor: {
      control: 'select',
      options: [...Object.keys(themes['light'].static.background)],
    },
    active: {control: 'boolean'},
    compact: {control: 'boolean'},
    disabled: {control: 'boolean'},
    loading: {control: 'boolean'},
    hasShadow: {control: 'boolean'},
  },
  args: {
    theme: 'light',
    text: 'text',
    interactiveColor: 'interactive_0',
    backgroundColor: 'background_0',
  },
  decorators: [
    (Story, {args}) => (
      <View
        style={{
          justifyContent: 'center',
          padding: 12,
          flex: 1,
          width: '100%',
          alignSelf: 'center',
          backgroundColor:
            getStaticColor(args.theme, args.textColor)?.background ||
            getStaticColor(args.theme, args.backgroundColor).background,
          gap: 12,
        }}
      >
        <Story args={{...args}} />
        <Story args={{...args, leftIcon: {svg: Add}}} />
        <Story args={{...args, rightIcon: {svg: Add}}} />
        <Story args={{...args, mode: 'secondary'}} />
        <Story
          args={{
            ...args,
            mode: 'secondary',
            leftIcon: {svg: Add},
          }}
        />
        <Story
          args={{
            ...args,
            mode: 'secondary',
            rightIcon: {svg: Add},
          }}
        />
        <Story args={{...args, mode: 'tertiary'}} />
        <Story
          args={{
            ...args,
            mode: 'tertiary',
            leftIcon: {svg: Add},
          }}
        />
        <Story
          args={{
            ...args,
            mode: 'tertiary',
            rightIcon: {svg: Add},
          }}
        />
      </View>
    ),
  ],
};

export default ButtonMeta;

export const Block = {};
export const Pill = {args: {type: 'pill'}};
export const Inline = {args: {type: 'inline'}};
