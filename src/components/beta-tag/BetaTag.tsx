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
      <ThemeText type={'body__tertiary'} color="background_accent_2">
        Beta
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  betaLabel: {
    backgroundColor: theme.static.status.info.background,
    paddingHorizontal: theme.spacings.small,
    paddingVertical: theme.spacings.xSmall,
    borderRadius: theme.border.radius.circle,
  },
}));
