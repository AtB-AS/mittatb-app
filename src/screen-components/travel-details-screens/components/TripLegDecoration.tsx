import React from 'react';
import {View} from 'react-native';
import {StyleSheet, tripLegDetail} from '@atb/theme';
import {DimensionOverrides} from './TripRow';

const decorationLineLeft = (labelWidth: number, gutter: number) =>
  labelWidth + gutter / 2 - tripLegDetail.decorationLineWidth / 2;

type TripLegDecorationProps = {
  hasStart?: boolean;
  hasCenter?: boolean;
  hasEnd?: boolean;
  color: string;
  dimensionOverrides?: DimensionOverrides;
};
export const TripLegDecoration: React.FC<TripLegDecorationProps> = ({
  color,
  hasStart,
  hasCenter,
  hasEnd,
  dimensionOverrides,
}) => {
  const style = useStyles();
  const colorStyle = {backgroundColor: color};

  const leftOverride =
    dimensionOverrides?.labelWidth != null &&
    dimensionOverrides?.decorationContainerWidth != null
      ? {
          left: decorationLineLeft(
            dimensionOverrides.labelWidth,
            dimensionOverrides.decorationContainerWidth,
          ),
        }
      : undefined;

  return (
    <View
      style={[
        style.decoration,
        colorStyle,
        hasStart && style.decorationWithStart,
        hasEnd && style.decorationWithEnd,
        !hasStart && style.decorationRoundedTop,
        !hasEnd && style.decorationRoundedBottom,
        leftOverride,
      ]}
    >
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
  decoration: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: theme.tripLegDetail.decorationLineWidth,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    left: decorationLineLeft(
      theme.tripLegDetail.labelWidth,
      theme.tripLegDetail.decorationContainerWidth,
    ),
  },
  decorationMarker: {
    width: theme.tripLegDetail.decorationLineEndWidth,
    left: -theme.tripLegDetail.decorationLineWidth,
    height: theme.tripLegDetail.decorationLineWidth,
    borderRadius: theme.border.radius.circle,
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
  decorationWithStart: {
    top: theme.tripLegDetail.decorationLineInset,
  },
  decorationWithEnd: {
    bottom: theme.tripLegDetail.decorationLineInset,
  },
  decorationRoundedTop: {
    borderTopLeftRadius: theme.tripLegDetail.decorationLineWidth / 2,
    borderTopRightRadius: theme.tripLegDetail.decorationLineWidth / 2,
  },
  decorationRoundedBottom: {
    borderBottomLeftRadius: theme.tripLegDetail.decorationLineWidth / 2,
    borderBottomRightRadius: theme.tripLegDetail.decorationLineWidth / 2,
  },
}));
