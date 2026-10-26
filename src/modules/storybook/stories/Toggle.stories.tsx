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

type ToggleProps = React.ComponentProps<typeof Toggle>;

type ToggleMetaProps = ThemedStoryProps<ToggleProps>;

const ToggleMeta: Meta<ToggleMetaProps> = {
  title: 'Toggle',
  component: Toggle,
  argTypes: {
    ...themedStoryControls,
  },
  args: {
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => {
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
            }}
          />
          <Story
            args={{
              ...args,
              value: false,
            }}
          />
          <Story
            args={{
              ...args,
              value: true,
              disabled: true,
            }}
          />
          <Story
            args={{
              ...args,
              value: false,
              disabled: true,
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
