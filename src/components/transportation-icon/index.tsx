import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {
  BusSide,
  TramSide,
  TrainSide,
  PlaneSide,
  FerrySide,
} from '../../assets/svg/icons/transportation';
import {LegMode} from '../../sdk';
import {StyleSheet} from '../../theme';
import {SvgProps} from 'react-native-svg';
import transportationColor from '../../utils/transportation-color';

export type TransportationIconProps = {
  mode?: LegMode;
  publicCode?: string;
  style?: StyleProp<ViewStyle>;
  circleStyle?: StyleProp<ViewStyle>;
};

const TransportationIcon: React.FC<TransportationIconProps> = ({
  mode,
  publicCode,
  style,
  circleStyle,
  children,
}) => {
  const styles = useStyle();
  const {fill, icon} = transportationColor(mode, publicCode);
  return (
    <View style={[styles.circle, {backgroundColor: fill}, circleStyle]}>
      {children ? (
        children
      ) : (
        <InnerIcon fill={icon} style={style} mode={mode} />
      )}
    </View>
  );
};

export default TransportationIcon;

function InnerIcon({
  mode,
  fill,
  style,
}: {
  fill: string;
  style?: StyleProp<ViewStyle>;
  mode?: LegMode;
}) {
  const innerIconProps: SvgProps = {
    width: '100%',
    height: '100%',
    fill,
    style,
  };

  switch (mode) {
    case 'bus':
      return <BusSide key="bus" {...innerIconProps} />;
    case 'tram':
      return <TramSide key="tram" {...innerIconProps} />;
    case 'rail':
      return <TrainSide key="rail" {...innerIconProps} />;
    case 'air':
      return <PlaneSide key="airport" {...innerIconProps} />;
    case 'water':
      return <FerrySide key="boat" {...innerIconProps} />;
    case 'unknown':
    default:
      return null;
  }
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  circle: {
    width: 20,
    height: 20,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
}));
