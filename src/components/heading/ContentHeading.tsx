import {StyleSheet} from '@atb/theme';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '../text';
import {ContrastColor, TextColor} from '@atb/theme/colors';

type ContentHeadingProps = {
  text: string;
  color?: TextColor | ContrastColor;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function ContentHeading({
  text,
  color = 'secondary',
  accessibilityLabel,
  style,
}: ContentHeadingProps): React.JSX.Element {
  const styles = useStyles();

  return (
    <View style={[styles.container, style]}>
      <ThemeText
        typography="body__s"
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
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
}));
