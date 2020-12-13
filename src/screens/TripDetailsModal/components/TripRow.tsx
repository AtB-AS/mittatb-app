import React from 'react';
import {View, ViewProps} from 'react-native';
import {StyleSheet} from '../../../theme';

type TripRowProps = {
  rowLabel: React.ReactNode;
  alignChildren?: 'flex-start' | 'flex-end' | 'center';
} & ViewProps;
const TripRow: React.FC<TripRowProps> = ({
  rowLabel,
  children,
  alignChildren = 'center',
  style,
}) => {
  const styles = useStyles();
  return (
    <View style={[styles.tripRow, {alignItems: alignChildren}, style]}>
      <View style={styles.leftColumn}>{rowLabel}</View>
      <View style={styles.decorationPlaceholder}></View>
      <View style={styles.rightColumn}>{children}</View>
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
    width: theme.tripLegDetail.labelWidth,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rightColumn: {flex: 1},
  decorationPlaceholder: {
    width: theme.tripLegDetail.decorationContainerWidth,
  },
}));
export default TripRow;
