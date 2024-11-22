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

type TileWithButtonMetaProps = ThemedStoryProps<
  TileWithButtonProps & {interactiveColorType: string}
>;

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
    interactiveColorType: {
      options: [...Object.keys(themes['light'].color.interactive)],
      control: {
        type: 'select',
      },
    },
    ...themedStoryControls,
  },
  args: {
    mode: 'compact',
    interactiveColorType: '0',
    accessibilityLabel: 'Accessibility label',
    buttonText: 'Button text',
    buttonSvg: SvgArrowRight,
    onPress: () => {},
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => {
      const interactiveColors = themes[args.theme].color.interactive;
      const storyInteractiveColor =
        interactiveColors[
          args.interactiveColorType as keyof typeof interactiveColors
        ];
      return (
        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
          <Story
            args={{
              ...args,
              interactiveColor: storyInteractiveColor,
              children: (
                <View
                  style={{width: 100, height: 50, backgroundColor: 'orange'}}
                />
              ),
            }}
          />
        </View>
      );
    },
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
