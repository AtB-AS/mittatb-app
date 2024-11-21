import React from 'react';
import {Button, ButtonProps} from '@atb/components/button';
import {ScrollView} from 'react-native';
import {themes} from '@atb/theme/colors';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react';

type ButtonMetaProps = ThemedStoryProps<ButtonProps>;

const ButtonMeta: Meta<ButtonMetaProps> = {
  title: 'Button',
  component: Button,
  argTypes: {
    interactiveColor: {
      control: 'select',
      options: [...Object.keys(themes['light'].color.interactive)],
    },
    backgroundColor: {
      control: 'select',
      options: [...Object.keys(themes['light'].color.background)],
    },
    active: {control: 'boolean'},
    compact: {control: 'boolean'},
    disabled: {control: 'boolean'},
    loading: {control: 'boolean'},
    hasShadow: {control: 'boolean'},
    ...themedStoryControls,
  },
  args: {
    text: 'text',
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => (
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          padding: 12,
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
      </ScrollView>
    ),
    ThemedStoryDecorator,
  ],
};

export default ButtonMeta;

export const Block = {};

export const Medium = {args: {type: 'medium'}};

export const Small = {args: {type: 'small'}};
