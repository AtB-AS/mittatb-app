import {StyleSheet} from '@atb/theme';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '../text';

type ContentHeadingProps = {
  text: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function ContentHeading({
  text,
  accessibilityLabel,
  style,
}: ContentHeadingProps): React.JSX.Element {
  const styles = useStyles();

  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="header"
    >
      <ThemeText
        typography="body__s"
        type="secondary"
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
