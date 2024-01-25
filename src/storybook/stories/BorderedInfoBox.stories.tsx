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
import {Meta} from '@storybook/react-native';
import {Mode} from '@atb-as/theme';
import {
  InteractiveColor,
  StaticColor,
  getStaticColor,
  isStaticColor,
  themes,
} from '@atb/theme/colors';

type BorderedInfoBoxMetaProps = BorderedInfoBoxProps & ThemedStoryProps;

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
    ThemedStoryDecorator,
  ],
};

const getColor = (
  theme: Mode,
  backgroundColor: StaticColor | InteractiveColor,
) => {
  if (isStaticColor(backgroundColor)) {
    return getStaticColor(theme, backgroundColor);
  } else {
    return themes[theme].interactive[backgroundColor]?.default;
  }
};

export default BorderedInfoBoxMeta;

export const Basic = {};
