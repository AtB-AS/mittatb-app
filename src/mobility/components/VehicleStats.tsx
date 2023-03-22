import {View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';

type VehicleStatsProps = {
  left: JSX.Element;
  right: JSX.Element;
};
export const VehicleStats = ({left, right}: VehicleStatsProps) => {
  const style = useStyles();
  return (
    <View style={style.vehicleStats}>
      <View style={[style.vehicleStat, style.vehicleStat__first]}>{left}</View>
      <View style={[style.vehicleStat, style.vehicleStat__last]}>{right}</View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  vehicleStats: {
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: 'row',
    padding: theme.spacings.medium,
  },
  vehicleStat: {
    flex: 1,
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.medium,
  },
  // Hack until 'gap' is supported properly.
  // https://github.com/styled-components/styled-components/issues/3628
  vehicleStat__first: {
    marginRight: theme.spacings.medium,
  },
  vehicleStat__last: {
    marginLeft: theme.spacings.medium,
  },
}));
