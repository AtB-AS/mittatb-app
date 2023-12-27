import {StyleSheet} from '@atb/theme';
import React, {forwardRef} from 'react';
import {View} from 'react-native';
import {ThemeText} from '../text';
import {ContrastColor, StaticColor, TextColor} from '@atb/theme/colors';

type ScreenHeadingProps = {
  text: string;
  color?: TextColor | StaticColor | ContrastColor;
  accessibilityLabel?: string;
};

export const ScreenHeading = forwardRef<any, ScreenHeadingProps>(
  (
    {
      text,
      color = 'background_accent_0',
      accessibilityLabel,
    }: ScreenHeadingProps,
    ref,
  ) => {
    const styles = useStyles();

    return (
      <View style={styles.container} ref={ref} accessible role="heading">
        <ThemeText
          type="heading--medium"
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
    marginHorizontal: theme.spacings.medium,
  },
}));
