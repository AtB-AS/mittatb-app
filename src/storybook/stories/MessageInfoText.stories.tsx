import React from 'react';
import {View} from 'react-native';
import {
  MessageInfoText,
  MessageInfoTextProps,
} from '@atb/components/message-info-text';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react';

type MessageInfoTextMetaProps = MessageInfoTextProps & ThemedStoryProps;

const MessageInfoTextMeta: Meta<MessageInfoTextMetaProps> = {
  title: 'MessageInfoText',
  component: MessageInfoText,
  argTypes: {
    ...themedStoryControls,
  },
  args: {
    message: 'The message body.',
    iconPosition: 'left',
    isMarkdown: false,
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => (
      <View style={{alignItems: 'center'}}>
        <Story args={{...args, type: 'info'}} />
        <Story args={{...args, type: 'valid'}} />
        <Story args={{...args, type: 'warning'}} />
        <Story args={{...args, type: 'error'}} />
      </View>
    ),
    ThemedStoryDecorator,
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
