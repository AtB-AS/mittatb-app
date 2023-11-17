import {View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';

type MobilityStatsProps = {
  top: JSX.Element;
  bottom: JSX.Element;
};
export const MobilityStats = ({top, bottom}: MobilityStatsProps) => {
  const style = useStyles();
  return (
    <View style={style.vehicleStats}>
      <View style={[style.vehicleStat, style.vehicleStat__first]}>{top}</View>
      <View style={[style.vehicleStat]}>{bottom}</View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  vehicleStats: {
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: 'column',
  },
  vehicleStat: {
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
  },
  vehicleStat__first: {
    marginBottom: theme.spacings.small,
  },
}));
