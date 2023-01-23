import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';

type TripLegDecorationProps = {
  hasStart?: boolean;
  hasCenter?: boolean;
  hasEnd?: boolean;
  color: string;
};
const TripLegDecoration: React.FC<TripLegDecorationProps> = ({
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
        ></View>
      )}
      {hasCenter && (
        <View
          style={[style.decorationMarker, style.decorationCenter, colorStyle]}
        ></View>
      )}
      {hasEnd && (
        <View
          style={[style.decorationMarker, style.decorationEnd, colorStyle]}
        ></View>
      )}
    </View>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  decorationPlaceholder: {
    width: theme.spacings.large,
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
    top: theme.spacings.large + theme.spacings.small,
  },
  decorationEnd: {
    position: 'absolute',
    bottom: 0,
  },
}));
export default TripLegDecoration;
