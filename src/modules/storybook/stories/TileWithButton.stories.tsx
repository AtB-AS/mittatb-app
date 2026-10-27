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
import SvgChevronRight from '@atb/assets/svg/mono-icons/navigation/ChevronRight';

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
    ...themedStoryControls,
  },
  args: {
    mode: 'compact',
    accessibilityLabel: 'Accessibility label',
    buttonText: 'Button text',
    buttonSvg: SvgChevronRight,
    onPress: () => {},
    ...themedStoryDefaultArgs,
  },
  decorators: [
    (Story, {args}) => {
      return (
        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
          <Story
            args={{
              ...args,
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
