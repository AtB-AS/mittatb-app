import {StaticColor, getStaticColor, themes} from '@atb/theme/colors';
import {Meta} from '@storybook/react-native';
import {View, ViewStyle} from 'react-native';

export type ThemedStoryProps = {
  theme: 'light' | 'dark';
  backgroundColor: StaticColor;
};

export const ThemedStoryDecorator = (
  Story: React.ComponentType,
  {args}: {args: any},
) => {
  return (
    <View
      style={
        {
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor:
            getStaticColor(args.theme, args.backgroundColor).background ||
            getStaticColor('light', 'background_0').background,
        } as ViewStyle
      }
    >
      <Story />
    </View>
  );
};

export const themedStoryControls: Meta['argTypes'] = {
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
};

export const themedStoryDefaultArgs: ThemedStoryProps = {
  theme: 'light',
  backgroundColor: 'background_0',
};
