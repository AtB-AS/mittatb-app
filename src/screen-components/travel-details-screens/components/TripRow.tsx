import React from 'react';
import {View, ViewProps} from 'react-native';
import {StyleSheet, tripLegDetail} from '@atb/theme';
import {NativeBlockButton} from '@atb/components/native-button';

export type DimensionOverrides = {
  labelWidth?: number;
  decorationContainerWidth?: number;
  labelAlignment?: 'flex-start' | 'flex-end';
};

/** Gap on either side of the leg decoration line, as specified in design. */
export const DECORATION_GAP = 19;

const DECORATION_LINE_WIDTH = tripLegDetail.decorationLineWidth;

// TODO: Remove / rename once old trip details are removed
export const NEW_TRIP_DIMENSIONS: DimensionOverrides = {
  labelWidth: 75,
  decorationContainerWidth: DECORATION_GAP * 2 + DECORATION_LINE_WIDTH,
  labelAlignment: 'flex-end',
};

/** The x that `TripLegDecoration` centres the leg line on. */
export const DECORATION_AXIS =
  (NEW_TRIP_DIMENSIONS.labelWidth ?? 0) +
  (NEW_TRIP_DIMENSIONS.decorationContainerWidth ?? 0) / 2;

type TripRowProps = {
  rowLabel?: React.ReactNode;
  alignChildren?: 'flex-start' | 'flex-end' | 'center';
  onPress?(): void;
  dimensionOverrides?: DimensionOverrides;
} & ViewProps;
export const TripRow: React.FC<TripRowProps> = ({
  rowLabel,
  children,
  alignChildren = 'center',
  style,
  onPress,
  dimensionOverrides,
  ...props
}) => {
  const styles = useStyles();
  const rowStyles = [styles.tripRow, {alignItems: alignChildren}, style];
  const isClickable = !!onPress;

  const rowContent = (
    <>
      <View
        style={[
          styles.leftColumn,
          dimensionOverrides?.labelWidth != null && {
            width: dimensionOverrides.labelWidth,
            minWidth: dimensionOverrides.labelWidth,
          },
          dimensionOverrides?.labelAlignment != null && {
            justifyContent: dimensionOverrides.labelAlignment,
          },
        ]}
      >
        {rowLabel}
      </View>
      <View
        style={[
          styles.decorationPlaceholder,
          dimensionOverrides?.decorationContainerWidth != null && {
            width: dimensionOverrides.decorationContainerWidth,
          },
        ]}
      />
      <View style={styles.rightColumn}>{children}</View>
    </>
  );
  if (isClickable) {
    return (
      <NativeBlockButton
        onPress={onPress}
        accessibilityRole="button"
        {...props}
      >
        <View style={rowStyles}>{rowContent}</View>
      </NativeBlockButton>
    );
  }
  return (
    <View style={rowStyles} accessible={true} {...props}>
      {rowContent}
    </View>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  tripRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacing.small,
  },
  leftColumn: {
    minWidth: theme.tripLegDetail.labelWidth,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rightColumn: {flex: 1},
  decorationPlaceholder: {
    width: theme.tripLegDetail.decorationContainerWidth,
  },
}));
