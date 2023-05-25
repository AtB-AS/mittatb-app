import React from 'react';
import {View, ViewProps, TouchableOpacity} from 'react-native';
import {StyleSheet} from '@atb/theme';

type TripRowProps = {
  rowLabel?: React.ReactNode;
  alignChildren?: 'flex-start' | 'flex-end' | 'center';
  onPress?(): void;
} & ViewProps;
export const TripRow: React.FC<TripRowProps> = ({
  rowLabel,
  children,
  alignChildren = 'center',
  style,
  onPress,
  ...props
}) => {
  const styles = useStyles();
  const rowStyles = [styles.tripRow, {alignItems: alignChildren}, style];
  const isClickable = !!onPress;

  const rowContent = (
    <>
      <View style={styles.leftColumn}>{rowLabel}</View>
      <View style={styles.decorationPlaceholder}></View>
      <View style={styles.rightColumn}>{children}</View>
    </>
  );
  if (isClickable) {
    return (
      <TouchableOpacity onPress={onPress} accessibilityRole="button" {...props}>
        <View style={rowStyles}>{rowContent}</View>
      </TouchableOpacity>
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
    paddingVertical: theme.spacings.small,
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
