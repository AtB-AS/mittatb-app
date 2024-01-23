import React from 'react';
import {View} from 'react-native';
import {themes} from '@atb/theme/colors';
import {Button, ButtonProps} from '@atb/components/button';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react-native';

type ButtonMetaProps = ButtonProps & ThemedStoryProps;

const ButtonMeta: Meta<ButtonMetaProps> = {
  title: 'Button',
  component: Button,
  argTypes: {
    interactiveColor: {
      control: 'select',
      options: [...Object.keys(themes['light'].interactive)],
    },
    active: {control: 'boolean'},
    compact: {control: 'boolean'},
    disabled: {control: 'boolean'},
    loading: {control: 'boolean'},
    ...themedStoryControls,
  },
  args: {
    text: 'text',
    interactiveColor: 'interactive_0',
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => (
      <View
        style={{
          justifyContent: 'center',
          padding: 12,
          flex: 1,
          width: '100%',
          rowGap: 12,
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
    ThemedStoryDecorator,
  ],
};

export default ButtonMeta;

export const Block = {};
export const Pill = {args: {type: 'pill'}};
export const Inline = {args: {type: 'inline'}};