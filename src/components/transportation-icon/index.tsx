import {LegMode} from '../../sdk';
import React from 'react';
import LottieView from 'lottie-react-native';
import {View, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '../../theme';
import BusFront from '../../assets/svg/BusFront';
import TramFront from '../../assets/svg/TramFront';
import colors from '../../theme/colors';

export type TransportationIconProps = {
  mode?: LegMode;
  isLive?: boolean;
  height?: number;
  emptyStyle?: StyleProp<ViewStyle>;
};

const TransportationIcon: React.FC<TransportationIconProps> = ({
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

export default TransportationIcon;

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
      return <BusFront fill="black" />;
    case 'tram':
      return <TramFront fill="black" />;
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
