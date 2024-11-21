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
import {getCommonColorMappings, getCommonColorOptions} from '../utils';
import {themes} from '@atb/theme/colors';

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
    (Story, {args}) => {
      const colorMappings = getCommonColorMappings(args.theme);
      const storyContrastColor =
        colorMappings[args.storyColor ?? ''] ??
        themes[args.theme].color.background.neutral[0];

      return (
        <View
          style={{
            justifyContent: 'center',
            padding: 12,
            flex: 1,
            gap: 12,
          }}
        >
          <Story
            args={{
              ...args,
              type: 'small',
              text: 'Small box',
              backgroundColor: storyContrastColor,
            }}
          />
          <Story
            args={{
              ...args,
              type: 'large',
              text: 'This is a large box',
              backgroundColor: storyContrastColor,
            }}
          />
          <Story
            args={{
              ...args,
              type: 'large',
              backgroundColor: storyContrastColor,
              children: (
                <View style={{flexDirection: 'row'}}>
                  <ThemeIcon
                    svg={Info}
                    style={{marginRight: 4}}
                    color={storyContrastColor}
                  />
                  <ThemeText
                    type="body__tertiary"
                    color={storyContrastColor}
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
      );
    },
    ThemedStoryDecorator,
  ],
};

export default BorderedInfoBoxMeta;

export const Basic = {};
