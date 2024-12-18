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
import {getColorByOption} from '../utils';
import {themes} from '@atb/theme/colors';

type ButtonMetaProps = ThemedStoryProps<
  ButtonProps & {interactiveColorType: string}
>;

const ButtonMeta: Meta<ButtonMetaProps> = {
  title: 'Button',
  component: Button,
  argTypes: {
    expand: {control: 'boolean'},
    active: {control: 'boolean'},
    compact: {control: 'boolean'},
    disabled: {control: 'boolean'},
    loading: {control: 'boolean'},
    hasShadow: {control: 'boolean'},
    interactiveColorType: {
      options: [...Object.keys(themes['light'].color.interactive)],
      control: {
        type: 'select',
      },
    },
    ...themedStoryControls,
  },
  args: {
    text: 'text',
    interactiveColorType: '0',
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => {
      const storyContrastColor = getColorByOption(args.theme, args.storyColor);
      const interactiveColors = themes[args.theme].color.interactive;
      const storyInteractiveColor =
        interactiveColors[
          args.interactiveColorType as keyof typeof interactiveColors
        ];
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
              interactiveColor: storyInteractiveColor,
            }}
          />
          <Story
            args={{
              ...args,
              leftIcon: {svg: Add},
              mode: 'primary',
              interactiveColor: storyInteractiveColor,
            }}
          />
          <Story
            args={{
              ...args,
              rightIcon: {svg: Add},
              mode: 'primary',
              interactiveColor: storyInteractiveColor,
            }}
          />
          <Story
            args={{
              ...args,
              mode: 'secondary',
              backgroundColor: storyContrastColor,
            }}
          />
          <Story
            args={{
              ...args,
              mode: 'secondary',
              leftIcon: {svg: Add},
              backgroundColor: storyContrastColor,
            }}
          />
          <Story
            args={{
              ...args,
              mode: 'secondary',
              rightIcon: {svg: Add},
              backgroundColor: storyContrastColor,
            }}
          />
          <Story
            args={{
              ...args,
              mode: 'tertiary',
              backgroundColor: storyContrastColor,
            }}
          />
          <Story
            args={{
              ...args,
              mode: 'tertiary',
              leftIcon: {svg: Add},
              backgroundColor: storyContrastColor,
            }}
          />
          <Story
            args={{
              ...args,
              mode: 'tertiary',
              rightIcon: {svg: Add},
              backgroundColor: storyContrastColor,
            }}
          />
        </ScrollView>
      );
    },
    ThemedStoryDecorator,
  ],
};

export default ButtonMeta;

export const Block = {};

export const Small = {args: {type: 'small'}};
