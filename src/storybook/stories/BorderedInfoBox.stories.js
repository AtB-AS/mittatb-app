import React from 'react';
import {View} from 'react-native';
import {getStaticColor, themes} from '@atb/theme/colors';
import {BorderedInfoBox} from "@atb/components/bordered-info-box";

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
          backgroundColor:
            getStaticColor(args.theme, args.backgroundColor)?.background ||
            getStaticColor(args.theme, 'background_0').background,
          gap: 12,
        }}
      >
        <Story args={{...args, type: 'large', text: "This is the large box"}} />
        <Story args={{...args, type: 'small', text: "Small box"}} />
      </View>
    ),
  ],
};

export default BorderedInfoBoxMeta;

export const Basic = {};
