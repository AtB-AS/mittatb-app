import React from 'react';
import {View} from 'react-native';
import {getStaticColor, themes} from '@atb/theme/colors';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Info} from '@atb/assets/svg/mono-icons/status';

const BorderedInfoBoxMeta = {
  title: 'BorderedInfoBox',
  component: BorderedInfoBox,
  argTypes: {
    theme: {
      control: {type: 'radio'},
      options: ['light', 'dark'],
    },
    backgroundColor: {
      control: 'select',
      options: [
        ...Object.keys(themes['light'].static.background),
        ...Object.keys(themes['light'].static.status),
        ...Object.keys(themes['light'].interactive),
      ],
    },
  },
  args: {
    theme: 'light',
    backgroundColor: 'background_0',
  },
  decorators: [
    (Story, {args}) => (
      <View
        style={{
          justifyContent: 'center',
          padding: 12,
          flex: 1,
          backgroundColor: getColor(args.theme, args.backgroundColor)
            .background,
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
                  colorType={getColor(args.theme, args.backgroundColor)}
                />
                <ThemeText
                  type="body__tertiary"
                  color={getColor(args.theme, args.backgroundColor)}
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
  ],
};

const getColor = (theme, backgroundColor) =>
  getStaticColor(theme, backgroundColor) ||
  themes[theme].interactive[backgroundColor]?.default ||
  getStaticColor(theme, 'background_0');

export default BorderedInfoBoxMeta;

export const Basic = {};
