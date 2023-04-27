import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import React from 'react';

type Props = {
  style?: StyleProp<ViewStyle>;
};
export const BetaTag = ({style}: Props) => {
  const styles = useStyles();
  return (
    <View style={[styles.betaLabel, style]}>
      <ThemeText color="background_accent_3" style={styles.betaLabelText}>
        BETA
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  betaLabel: {
    backgroundColor: theme.static.background.background_accent_3.background,
    paddingHorizontal: theme.spacings.small,
    paddingVertical: theme.spacings.small,
    borderRadius: theme.border.radius.regular,
  },
  betaLabelText: {
    fontSize: 8,
    lineHeight: 9,
  },
}));
