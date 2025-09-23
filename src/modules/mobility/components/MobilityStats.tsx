import {View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';

type MobilityStatsProps = {
  first: React.JSX.Element;
  second: React.JSX.Element;
};
export const MobilityStats = ({first, second}: MobilityStatsProps) => {
  const style = useStyles();
  return (
    <View style={style.vehicleStats}>
      <View style={[style.vehicleStat, style.vehicleStat__first]}>{first}</View>
      <View style={style.vehicleStat}>{second}</View>
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
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.regular,
  },
  vehicleStat__first: {
    marginBottom: theme.spacing.small,
  },
}));
