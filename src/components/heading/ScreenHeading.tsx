import {useThemeContext} from '@atb/theme';
import React, {forwardRef} from 'react';
import {View} from 'react-native';
import {ThemeText} from '../text';

type ScreenHeadingProps = {
  text: string;
  accessibilityLabel?: string;
  isLarge?: boolean;
};

export const ScreenHeading = forwardRef<any, ScreenHeadingProps>(
  ({text, accessibilityLabel, isLarge}: ScreenHeadingProps, ref) => {
    const {theme} = useThemeContext();
    const color = theme.color.background.accent[0];

    return (
      <View
        style={{
          marginHorizontal: isLarge
            ? theme.spacing.medium
            : theme.spacing.xLarge,
          paddingLeft: isLarge ? theme.spacing.medium : 0,
          marginVertical: 0,
        }}
        ref={ref}
        accessible
        role="heading"
      >
        <ThemeText
          typography={isLarge ? 'heading__2xl' : 'heading__l'}
          color={color}
          accessibilityLabel={accessibilityLabel}
        >
          {text}
        </ThemeText>
      </View>
    );
  },
);
