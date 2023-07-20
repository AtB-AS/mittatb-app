import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {InfoChip} from '../info-chip';

type Props = {
  text: string;
  style?: StyleProp<ViewStyle>;
};
export const InfoTag = ({text, style}: Props) => {
  const styles = useStyles();
  return (
    <InfoChip
      text={text}
      interactiveColor="interactive_0"
      style={[styles.infoLabel, style]}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  infoLabel: {
    backgroundColor: theme.static.status.info.background,
    paddingHorizontal: theme.spacings.small,
    borderRadius: theme.border.radius.circle,
  },
}));
