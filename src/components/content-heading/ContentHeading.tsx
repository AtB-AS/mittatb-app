import {StyleSheet} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '../text';
import {ContrastColor, StaticColor, TextColor} from '@atb/theme/colors';

type ContentHeadingProps = {
  text: string;
  color?: TextColor | StaticColor | ContrastColor;
  accessibilityLabel?: string;
};

export function ContentHeading({
  text,
  color = 'secondary',
  accessibilityLabel,
}: ContentHeadingProps): JSX.Element {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <ThemeText
        type="body__secondary"
        color={color}
        accessibilityLabel={accessibilityLabel}
      >
        {text}
      </ThemeText>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
}));
