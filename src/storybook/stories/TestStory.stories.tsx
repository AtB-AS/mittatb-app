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
import {Meta} from '@storybook/react-native';

type MessageInfoTextMetaProps = MessageInfoTextProps & ThemedStoryProps;

const MessageInfoTextMeta: Meta<MessageInfoTextMetaProps> = {
  title: 'TestStory',
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
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export default MessageInfoTextMeta;

export const RightIcon = {
  args: {message: 'Right sided icon', iconPosition: 'right'},
};
