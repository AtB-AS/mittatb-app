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
import {getColorByOption} from '../utils';

type MessageInfoTextMetaProps = ThemedStoryProps<MessageInfoTextProps>;

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
    (Story, {args}) => {
      const storyContrastColor = getColorByOption(args.theme, args.storyColor);
      return (
        <View style={{alignItems: 'center'}}>
          <Story
            args={{...args, type: 'info', textColor: storyContrastColor}}
          />
          <Story
            args={{...args, type: 'valid', textColor: storyContrastColor}}
          />
          <Story
            args={{...args, type: 'warning', textColor: storyContrastColor}}
          />
          <Story
            args={{...args, type: 'error', textColor: storyContrastColor}}
          />
        </View>
      );
    },
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
