import React from 'react';
import {View} from 'react-native';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';
import {Meta} from '@storybook/react';
import {TileWithButton, TileWithButtonProps} from '@atb/components/tile';
import SvgArrowRight from '@atb/assets/svg/mono-icons/navigation/ArrowRight';
import {themes} from '@atb/theme/colors';

type TileWithButtonMetaProps = ThemedStoryProps<TileWithButtonProps>;

const TileWithButtonMeta: Meta<TileWithButtonMetaProps> = {
  title: 'TileWithButton',
  component: TileWithButton,
  argTypes: {
    mode: {
      options: ['compact', 'spacious'],
      control: {
        type: 'select',
      },
    },
    interactiveColor: {
      options: [...Object.keys(themes['light'].color.interactive)],
      control: {
        type: 'select',
      },
    },
    ...themedStoryControls,
  },
  args: {
    mode: 'compact',
    interactiveColor: themes.light.color.interactive[2],
    accessibilityLabel: 'Accessibility label',
    buttonText: 'Button text',
    buttonSvg: SvgArrowRight,
    onPress: () => {},
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (_: any, {args}: {args: any}) => (
      <View style={{justifyContent: 'center', flexDirection: 'row'}}>
        {/* FIXME: Should use <Story> here, but that doesn't work well with children */}
        <TileWithButton {...args}>
          <View style={{width: 100, height: 50, backgroundColor: 'orange'}} />
        </TileWithButton>
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export default TileWithButtonMeta;

export const Compact: Meta<TileWithButtonMetaProps> = {
  args: {
    mode: 'compact',
  },
};
export const Spacious: Meta<TileWithButtonMetaProps> = {
  args: {
    mode: 'spacious',
  },
};
