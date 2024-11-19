import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';

type TripLegDecorationProps = {
  hasStart?: boolean;
  hasCenter?: boolean;
  hasEnd?: boolean;
  color: string;
};
export const TripLegDecoration: React.FC<TripLegDecorationProps> = ({
  color,
  hasStart,
  hasCenter,
  hasEnd,
}) => {
  const style = useStyles();
  const colorStyle = {backgroundColor: color};
  return (
    <View style={[style.decoration, colorStyle]}>
      {hasStart && (
        <View
          style={[style.decorationMarker, style.decorationStart, colorStyle]}
        />
      )}
      {hasCenter && (
        <View
          style={[style.decorationMarker, style.decorationCenter, colorStyle]}
        />
      )}
      {hasEnd && (
        <View
          style={[style.decorationMarker, style.decorationEnd, colorStyle]}
        />
      )}
    </View>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  decorationPlaceholder: {
    width: theme.spacing.large,
  },
  decoration: {
    position: 'absolute',
    height: '100%',
    width: theme.tripLegDetail.decorationLineWidth,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    left:
      theme.tripLegDetail.labelWidth +
      theme.tripLegDetail.decorationContainerWidth / 2,
  },
  decorationMarker: {
    width: theme.tripLegDetail.decorationLineEndWidth,
    left: -theme.tripLegDetail.decorationLineWidth,
    height: theme.tripLegDetail.decorationLineWidth,
  },
  decorationStart: {
    position: 'absolute',
    top: 0,
  },
  decorationCenter: {
    position: 'absolute',
    top: theme.spacing.large + theme.spacing.small,
  },
  decorationEnd: {
    position: 'absolute',
    bottom: 0,
  },
}));
