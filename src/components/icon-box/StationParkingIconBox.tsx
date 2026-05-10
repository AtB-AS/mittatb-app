import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {StyleSheet, useThemeContext} from '@atb/theme';
import {Parking as ParkingLight} from '@atb/assets/svg/color/icons/vehicles/light';
import {Parking as ParkingDark} from '@atb/assets/svg/color/icons/vehicles/dark';

export type StationParkingIconBoxProps = {
  style?: StyleProp<ViewStyle>;
};

export const StationParkingIconBox: React.FC<StationParkingIconBoxProps> = ({
  style,
}) => {
  const {theme, themeName} = useThemeContext();
  const styles = useStyles();
  const Parking = themeName === 'light' ? ParkingLight : ParkingDark;

  return (
    <View
      style={[
        styles.iconBox,
        style,
        {backgroundColor: theme.color.status.valid.primary.background},
      ]}
    >
      <Parking />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  iconBox: {
    padding: theme.spacing.xSmall,
    borderRadius: theme.border.radius.small,
  },
}));
