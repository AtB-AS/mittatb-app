import {LegMode} from '../../../sdk';
import React from 'react';
import LottieView from 'lottie-react-native';
import {View, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '../../../theme';
import BusFront from '../svg/BusFront';
import TramFront from '../svg/TramFront';
import colors from '../../../theme/colors';
import TrainFront from '../svg/TrainFront';
import PlaneFront from '../svg/PlaneFront';
import BoatFront from '../svg/BoatFront';

export type TransportationIconProps = {
  mode?: LegMode;
  isLive?: boolean;
  height?: number;
  emptyStyle?: StyleProp<ViewStyle>;
};

const RealTimeLocationIcon: React.FC<TransportationIconProps> = ({
  mode,
  isLive,
  height,
  emptyStyle,
  children,
}) => {
  const styles = useStyle();
  if (!isLive) {
    return (
      <EmptyCircle
        style={[emptyStyle, height ? {height, width: height} : undefined]}
      >
        {children ? children : <InnerIcon mode={mode} />}
      </EmptyCircle>
    );
  }

  return (
    <View
      style={[styles.container, height ? {height, width: height} : undefined]}
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
      return <BusFront key="bus" fill="black" width={20} />;
    case 'tram':
      return <TramFront key="tram" fill="black" width={20} />;
    case 'rail':
      return <TrainFront key="rail" fill="black" width={20} />;
    case 'air':
      return <PlaneFront key="airport" fill="black" width={20} />;
    case 'water':
      return <BoatFront key="boat" fill="black" width={12} />;
    case 'unknown':
    default:
      return null;
  }
}

const useStyle = StyleSheet.createThemeHook(theme => ({
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
    backgroundColor: colors.primary.green,
  },
}));
