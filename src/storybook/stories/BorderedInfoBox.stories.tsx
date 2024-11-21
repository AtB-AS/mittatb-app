import React from 'react';
import {View} from 'react-native';
import {
  BorderedInfoBox,
  BorderedInfoBoxProps,
} from '@atb/components/bordered-info-box';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Info} from '@atb/assets/svg/mono-icons/status';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react';

type BorderedInfoBoxMetaProps = ThemedStoryProps<BorderedInfoBoxProps>;

const BorderedInfoBoxMeta: Meta<BorderedInfoBoxMetaProps> = {
  title: 'BorderedInfoBox',
  component: BorderedInfoBox,
  argTypes: {
    ...themedStoryControls,
  },
  args: {
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => (
      <View
        style={{
          justifyContent: 'center',
          padding: 12,
          flex: 1,
          gap: 12,
        }}
      >
        <Story args={{...args, type: 'small', text: 'Small box'}} />
        <Story args={{...args, type: 'large', text: 'This is a large box'}} />
        <Story
          args={{
            ...args,
            type: 'large',
            children: (
              <View style={{flexDirection: 'row'}}>
                <ThemeIcon
                  svg={Info}
                  style={{marginRight: 4}}
                  color={args.backgroundColor}
                />
                <ThemeText
                  type="body__tertiary"
                  color={args.backgroundColor}
                  style={{flex: 1}}
                >
                  This is a large box with custom child component. Can have
                  icons, line breaks, and such.
                </ThemeText>
              </View>
            ),
          }}
        />
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export default BorderedInfoBoxMeta;

export const Basic = {};
