import {LegMode} from '../../../sdk';
import React from 'react';
import LottieView from 'lottie-react-native';
import {View, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '../../../theme';
import BusSide from '../svg/BusSide';
import TramSide from '../svg/TramSide';
import colors from '../../../theme/colors';
import TrainSide from '../svg/TrainSide';
import PlaneAbove from '../svg/PlaneAbove';
import FerrySide from '../svg/FerrySide';

export type TransportationIconProps = {
  mode?: LegMode;
  isLive?: boolean;
  height?: number;
  emptyStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

const RealTimeLocationIcon: React.FC<TransportationIconProps> = ({
  mode,
  isLive,
  height,
  emptyStyle,
  children,
  style,
}) => {
  const styles = useStyle();
  if (!isLive) {
    return (
      <EmptyCircle
        style={[
          emptyStyle,
          height ? {height: height - 12, width: height - 12} : undefined,
          style,
        ]}
      >
        {children ? children : <InnerIcon mode={mode} />}
      </EmptyCircle>
    );
  }

  return (
    <View
      style={[
        styles.container,
        height ? {height, width: height} : undefined,
        style,
      ]}
    >
      <LottieView source={require('./realtime-animation.json')} autoPlay loop />
      {children ? children : <InnerIcon mode={mode} />}
    </View>
  );
};

export default RealTimeLocationIcon;

type EmptyCircleProps = {
  style?: StyleProp<ViewStyle>;
};
const EmptyCircle: React.FC<EmptyCircleProps> = ({style, children}) => {
  const styles = useStyle();
  return <View style={[styles.emptyCircle, style]}>{children}</View>;
};

function InnerIcon({mode}: TransportationIconProps) {
  switch (mode) {
    case 'bus':
      return <BusSide key="bus" fill="black" />;
    case 'tram':
      return <TramSide key="tram" fill="black" />;
    case 'rail':
      return <TrainSide key="rail" fill="black" />;
    case 'air':
      return <PlaneAbove key="airport" fill="black" />;
    case 'water':
      return <FerrySide key="boat" fill="black" />;
    case 'unknown':
    default:
      return null;
  }
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    width: 28,
    height: 28,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 18,
    height: 18,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: colors.secondary.cyan,
  },
}));
