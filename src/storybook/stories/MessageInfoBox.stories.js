import React from 'react';
import {View} from 'react-native';
import {getStaticColor} from '@atb/theme/colors';
import {MessageInfoBox} from '@atb/components/message-info-box';

const ON_PRESS_CONFIG = {action: () => {}, text: 'Press me!'};
const ON_DISMISS = () => {};

const MessageInfoBoxMeta = {
  title: 'MessageInfoBox',
  component: MessageInfoBox,
  argTypes: {
    theme: {
      control: 'select',
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
  },
  args: {
    theme: 'light',
    message: 'The message body.',
    title: 'The message title',
    onPressConfig: undefined,
    noStatusIcon: false,
    isMarkdown: false,
  },
  decorators: [
    (Story, {args}) => (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          flex: 1,
          backgroundColor:
            getStaticColor(args.theme, args.textColor)?.background ||
            getStaticColor(args.theme, 'background_0').background,
          gap: 12,
        }}
      >
        <Story args={{...args, type: 'info'}} />
        <Story args={{...args, type: 'valid'}} />
        <Story args={{...args, type: 'warning'}} />
        <Story args={{...args, type: 'error'}} />
      </View>
    ),
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
