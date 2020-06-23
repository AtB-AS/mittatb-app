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
import lineColor from '../../utils/line-color';

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
  return (
    <View
      style={[
        styles.circle,
        {backgroundColor: lineColor(mode, publicCode)},
        circleStyle,
      ]}
    >
      {children ? children : <InnerIcon style={style} mode={mode} />}
    </View>
  );
};

export default TransportationIcon;

function InnerIcon({
  mode,
  style,
}: {
  style?: StyleProp<ViewStyle>;
  mode?: LegMode;
}) {
  const innerIconProps: SvgProps = {
    width: '100%',
    height: '100%',
    fill: 'black',
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
