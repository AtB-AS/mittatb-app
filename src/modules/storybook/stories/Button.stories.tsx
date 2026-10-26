import React from 'react';
import {Button, ButtonProps} from '@atb/components/button';
import {ScrollView} from 'react-native';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react';
import {themes} from '@atb/theme/colors';

type ButtonMetaProps = ThemedStoryProps<ButtonProps>;

const ButtonMeta: Meta<ButtonMetaProps> = {
  title: 'Button',
  component: Button,
  argTypes: {
    expanded: {control: 'boolean'},
    disabled: {control: 'boolean'},
    loading: {control: 'boolean'},
    hasShadow: {control: 'boolean'},
    surfaceColor: {
      options: [...Object.keys(themes['light'].color.surface)],
      control: {
        type: 'select',
      },
    },
    ...themedStoryControls,
  },
  args: {
    text: 'text',
    surfaceColor: 'accent',
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => {
      return (
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'center',
            padding: 12,
            width: '100%',
            rowGap: 12,
          }}
        >
          <Story
            args={{
              ...args,
              mode: 'primary',
            }}
          />
          <Story
            args={{
              ...args,
              leftIcon: {svg: Add},
              mode: 'primary',
            }}
          />
          <Story
            args={{
              ...args,
              rightIcon: {svg: Add},
              mode: 'primary',
            }}
          />
          <Story
            args={{
              ...args,
              mode: 'secondary',
            }}
          />
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
          <Story
            args={{
              ...args,
              mode: 'tertiary',
            }}
          />
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
      );
    },
    ThemedStoryDecorator,
  ],
};

export default ButtonMeta;

export const Large = {args: {type: 'large'}};

export const Small = {args: {type: 'small'}};
