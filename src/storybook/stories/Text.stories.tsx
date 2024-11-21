import type {Meta, StoryObj} from '@storybook/react';
import {Text} from 'react-native';
import {
  ThemedStoryDecorator,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';

const meta = {
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: 'Hello, World!',
    ...themedStoryDefaultArgs,
  },
  argTypes: {
    ...themedStoryControls,
  },
  decorators: [(Story) => <Story />, ThemedStoryDecorator],
};
