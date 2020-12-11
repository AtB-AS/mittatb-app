import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '../../../../theme';

type TripLegDecorationProps = {
  hasStart: boolean;
  hasEnd: boolean;
  color: string;
};
const TripLegDecoration: React.FC<TripLegDecorationProps> = ({
  color,
  hasStart,
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
    left:
      theme.tripLegDetail.labelWidth +
      theme.tripLegDetail.decorationContainerWidth / 2,
    width: theme.tripLegDetail.decorationLineWidth,
    backgroundColor: theme.background.accent,
  },
  decorationMarker: {
    position: 'absolute',
    width: theme.tripLegDetail.decorationLineEndWidth,
    left: -theme.tripLegDetail.decorationLineWidth,
    height: theme.tripLegDetail.decorationLineWidth,
    backgroundColor: theme.background.accent,
  },
  decorationStart: {
    top: 0,
  },
  decorationEnd: {
    bottom: 0,
  },
}));
export default TripLegDecoration;
