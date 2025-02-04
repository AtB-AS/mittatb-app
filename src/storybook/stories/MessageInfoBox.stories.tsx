import React from 'react';
import {View} from 'react-native';
import {
  MessageInfoBox,
  MessageInfoBoxProps,
} from '@atb/components/message-info-box';
import {
  ThemedStoryProps,
  ThemedStoryDecorator,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react';

const ON_PRESS_CONFIG = {action: () => {}, text: 'Press me!'};
const ON_DISMISS = () => {};

type MessageInfoBoxMetaProps = ThemedStoryProps<MessageInfoBoxProps>;

const MessageInfoBoxMeta: Meta<MessageInfoBoxMetaProps> = {
  title: 'MessageInfoBox',
  component: MessageInfoBox,
  argTypes: {
    theme: {
      control: {type: 'radio'},
      options: ['light', 'dark'],
    },
    onDismiss: {
      label: 'dismissible',
      mapping: {
        true: ON_DISMISS,
        false: undefined,
      },
      control: 'boolean',
    },
    onPressConfig: {
      label: 'pressable',
      mapping: {
        true: ON_PRESS_CONFIG,
        false: undefined,
      },
      control: 'boolean',
    },
    ...themedStoryControls,
  },
  args: {
    message: 'The message body.',
    title: 'The message title',
    onPressConfig: undefined,
    noStatusIcon: false,
    isMarkdown: false,
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          margin: 12,
          flex: 1,
          rowGap: 12,
        }}
      >
        <Story args={{...args, type: 'info'}} />
        <Story args={{...args, type: 'valid'}} />
        <Story args={{...args, type: 'warning'}} />
        <Story args={{...args, type: 'error'}} />
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export default MessageInfoBoxMeta;

export const Standard = {};
export const Minimal = {args: {title: undefined, noStatusIcon: true}};
export const Maximal = {
  args: {
    onDismiss: ON_DISMISS,
    onPressConfig: ON_PRESS_CONFIG,
    isMarkdown: true,
    message: 'Message **with** markdown _enabled_.',
  },
};
