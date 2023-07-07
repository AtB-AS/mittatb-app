import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {InfoChip} from '../info-chip';

type Props = {
  style?: StyleProp<ViewStyle>;
};
export const BetaTag = ({style}: Props) => {
  const styles = useStyles();
  return (
    <InfoChip
      text="Beta"
      interactiveColor="interactive_0"
      style={[styles.betaLabel, style]}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  betaLabel: {
    backgroundColor: theme.static.status.info.background,
    paddingHorizontal: theme.spacings.small,
    borderRadius: theme.border.radius.circle,
  },
}));
