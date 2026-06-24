import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {StyleSheet} from '@atb/theme';
import {ThemeIcon} from '../theme-icon';
import {ThemedParkingIcon} from '@atb/theme/ThemedAssets';

export type StationParkingIconBoxProps = {
  style?: StyleProp<ViewStyle>;
};

export const StationParkingIconBox: React.FC<StationParkingIconBoxProps> = ({
  style,
}) => {
  const styles = useStyles();

  return (
    <View style={[styles.iconBox, style]}>
      <ThemeIcon svg={ThemedParkingIcon} size="large" />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  iconBox: {
    padding: theme.spacing.xSmall,
    borderRadius: theme.border.radius.small,
  },
}));
