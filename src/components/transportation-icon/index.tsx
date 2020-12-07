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
};

const TransportationIcon: React.FC<TransportationIconProps> = ({
  mode,
  publicCode,
  style,
  children,
}) => {
  const styles = useStyle();
  const {color} = transportationColor(mode, publicCode);

  return (
    <View style={styles.iconContainer}>
      {children ? (
        children
      ) : (
        <InnerIcon fill={color} style={style} mode={mode} />
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
      return (
        <BusSide accessibilityLabel="Buss" key="bus" {...innerIconProps} />
      );
    case 'tram':
      return (
        <TramSide accessibilityLabel="Trikk" key="tram" {...innerIconProps} />
      );
    case 'rail':
      return (
        <TrainSide accessibilityLabel="Tog" key="rail" {...innerIconProps} />
      );
    case 'air':
      return (
        <PlaneSide accessibilityLabel="Fly" key="airport" {...innerIconProps} />
      );
    case 'water':
      return (
        <FerrySide accessibilityLabel="Ferge" key="boat" {...innerIconProps} />
      );
    case 'unknown':
    default:
      return null;
  }
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  iconContainer: {
    width: 20,
    height: 20,
  },
}));
