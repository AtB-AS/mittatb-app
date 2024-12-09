import {StyleSheet, useTheme} from '@atb/theme';
import React, {forwardRef} from 'react';
import {View} from 'react-native';
import {ThemeText} from '../text';
import {ContrastColor, TextColor} from '@atb/theme/colors';

type ScreenHeadingProps = {
  text: string;
  color?: TextColor | ContrastColor;
  accessibilityLabel?: string;
};

export const ScreenHeading = forwardRef<any, ScreenHeadingProps>(
  ({text, color, accessibilityLabel}: ScreenHeadingProps, ref) => {
    const styles = useStyles();
    const {theme} = useTheme();
    color = color ?? theme.color.background.accent[0];

    return (
      <View style={styles.container} ref={ref} accessible role="heading">
        <ThemeText
          typography="heading--medium"
          color={color}
          accessibilityLabel={accessibilityLabel}
        >
          {text}
        </ThemeText>
      </View>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginHorizontal: theme.spacing.medium,
  },
}));
