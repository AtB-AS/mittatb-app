import React from 'react';
import {View} from 'react-native';
import {Toggle} from '@atb/components/toggle';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react';
import {themes} from '@atb/theme/colors';

type ToggleProps = React.ComponentProps<typeof Toggle>;

type ToggleMetaProps = ThemedStoryProps<
  ToggleProps & {interactiveColorType: string}
>;

const ToggleMeta: Meta<ToggleMetaProps> = {
  title: 'Toggle',
  component: Toggle,
  argTypes: {
    interactiveColorType: {
      options: [...Object.keys(themes['light'].color.interactive)],
      control: {
        type: 'select',
      },
    },
    ...themedStoryControls,
  },
  args: {
    interactiveColorType: '2',
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => {
      const interactiveColors = themes[args.theme].color.interactive;
      const storyInteractiveColor =
        interactiveColors[
          args.interactiveColorType as keyof typeof interactiveColors
        ];
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 12,
            flex: 1,
            rowGap: 12,
          }}
        >
          <Story
            args={{
              ...args,
              value: true,
              interactiveColor: storyInteractiveColor,
            }}
          />
          <Story
            args={{
              ...args,
              value: false,
              interactiveColor: storyInteractiveColor,
            }}
          />
          <Story
            args={{
              ...args,
              value: true,
              disabled: true,
              interactiveColor: storyInteractiveColor,
            }}
          />
          <Story
            args={{
              ...args,
              value: false,
              disabled: true,
              interactiveColor: storyInteractiveColor,
            }}
          />
        </View>
      );
    },
    ThemedStoryDecorator,
  ],
};

export default ToggleMeta;

export const Basic = {};
