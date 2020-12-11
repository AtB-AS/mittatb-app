import React from 'react';
import {View, ViewProps} from 'react-native';
import {StyleSheet} from '../../../../theme';

type TripRowProps = {
  rowLabel: React.ReactNode;
  alignChildren?: 'flex-start' | 'flex-end' | 'center';
} & ViewProps;
const TripRow: React.FC<TripRowProps> = ({
  rowLabel,
  children,
  alignChildren = 'center',
}) => {
  const style = useStyles();
  return (
    <View style={[style.tripRow, {alignItems: alignChildren}]}>
      <View style={style.leftColumn}>{rowLabel}</View>
      <View style={style.decorationPlaceholder}></View>
      <View style={style.rightColumn}>{children}</View>
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
