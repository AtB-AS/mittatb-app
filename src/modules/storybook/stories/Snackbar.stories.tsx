import React from 'react';
import {
  Snackbar,
  SnackbarProps,
  SnackbarContent,
} from '@atb/components/snackbar';
import {View} from 'react-native';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react';
import {ThemeText} from '@atb/components/text';
import {Chat} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';

type MetaPropsInputLayer = SnackbarContent & {
  actionButtonText: string;
}; // to easily input title, description and action button text, define them directly as props, and map as input to Story

type SnackbarMetaProps = ThemedStoryProps<SnackbarProps & MetaPropsInputLayer>;

const SnackbarMeta: Meta<SnackbarMetaProps> = {
  title: 'Snackbar',
  component: Snackbar,
  argTypes: {
    title: {type: 'string'},
    description: {type: 'string'},
    position: {
      control: {type: 'radio'},
      options: ['top', 'bottom'],
    },
    actionButtonText: {type: 'string'},
    isDismissable: {type: 'boolean'},
    customVisibleDurationMS: {
      type: 'number',
    },
    ...themedStoryControls,
  },
  args: {
    title: 'The Title',
    description: 'An amazing description',
    position: 'top',
    actionButtonText: undefined,
    isDismissable: false,
    customVisibleDurationMS: undefined,
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => (
      <View
        style={{
          flex: 0.5,
          backgroundColor: args.theme === 'light' ? '#eee' : '#333',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Story
          args={{
            ...args,
            ...{
              content: {
                iconNode: args.iconNode,
                title: args.title,
                description: args.description,
              },
            },
            ...(args.actionButtonText
              ? {
                  actionButton: {
                    onPress: () => {},
                    text: args.actionButtonText,
                    expanded: false,
                  },
                }
              : undefined),
          }}
        />
        <ThemeText
          color="secondary"
          style={{
            width: '50%',
            textAlign: 'center',
            opacity: 0.5,
          }}
        >
          When the Snackbar shows outside of this gray area, it means that it is
          not visible when in use in the app.
        </ThemeText>
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export default SnackbarMeta;

export const Minimal = {
  args: {
    title: undefined,
    description: 'Some short description here',
  },
};

export const Medium = {
  args: {
    iconNode: <ThemeIcon svg={Chat} />,
    title: undefined,
    description: 'Some medium long description describing something here',
    isDismissable: true,
  },
};

export const Maximal = {
  args: {
    iconNode: <ThemeIcon svg={Chat} />,
    title: 'The Title',
    description: 'Some rather long and detailed description right here',
    isDismissable: true,
    actionButton: {
      text: 'Action',
      onPress: () => {
        // aaand action
      },
    },
  },
};
