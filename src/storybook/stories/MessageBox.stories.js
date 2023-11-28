import React from 'react';
import {View} from 'react-native';
import {getStaticColor, themes} from '@atb/theme/colors';
import {MessageBox} from '@atb/components/message-box';

const ON_PRESS_CONFIG = {action: () => {}, text: 'Press me!'};
const ON_DISMISS = () => {};

const MessageBoxMeta = {
  title: 'MessageBox',
  component: MessageBox,
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
    type: {
      control: 'select',
      options: Object.keys(themes['light'].static.status),
    },
    onDismiss: {
      label: 'dismissible',
      mapping: {
        true: ON_DISMISS,
        false: undefined,
      },
      control: 'boolean',
    },
    subtle: {control: 'boolean'},
    textColor: {
      label: 'textColor (if subtle)',
      if: {arg: 'subtle'},
      control: 'select',
      options: [
        ...Object.keys(themes['light'].static.background),
        ...Object.keys(themes['light'].static.status),
      ],
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
    type: 'info',
    theme: 'light',
    message: 'The message body.',
    title: 'The message title',
    onPressConfig: undefined,
    noStatusIcon: false,
    isMarkdown: false,
    subtle: false,
    textColor: undefined,
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
        }}
      >
        <Story />
      </View>
    ),
  ],
};

export default MessageBoxMeta;

export const Info = {args: {type: 'info'}};
export const Valid = {args: {type: 'valid'}};
export const Warning = {args: {type: 'warning'}};
export const Error = {args: {type: 'error'}};

export const InfoSubtle = {args: {type: 'info', subtle: true}};
export const ValidSubtle = {args: {type: 'valid', subtle: true}};
export const WarningSubtle = {args: {type: 'warning', subtle: true}};
export const ErrorSubtle = {args: {type: 'error', subtle: true}};
export const NoTitle = {args: {title: undefined}};
export const NoIcon = {args: {noStatusIcon: true}};
export const WithMarkdown = {args: {isMarkdown: true, message: "A **message** with *markdown*."}};

export const Pressable = {args: {onPressConfig: ON_PRESS_CONFIG}};
export const Dismissible = {args: {onDismiss: ON_DISMISS}};
