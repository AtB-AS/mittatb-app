import React from 'react';
import {View} from 'react-native';
import {getStaticColor} from '@atb/theme/colors';
import {MessageInfoText} from '@atb/components/message-info-text';

const MessageInfoTextMeta = {
  title: 'MessageInfoText',
  component: MessageInfoText,
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
  args: {
    theme: 'light',
    message: 'The message body.',
    iconPosition: 'left',
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

export default MessageInfoTextMeta;

export const LeftIcon = {};
export const RightIcon = {
  args: {message: 'Right sided icon', iconPosition: 'right'},
};
export const WithMarkdown = {
  args: {
    isMarkdown: true,
    message: 'Message **with** markdown _enabled_.',
  },
};
