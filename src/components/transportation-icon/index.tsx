import {LegMode} from '../../sdk';
import React from 'react';
import LottieView from 'lottie-react-native';
import {View} from 'react-native';
import {StyleSheet} from '../../theme';
import BusFront from '../../assets/svg/BusFront';
import TramFront from '../../assets/svg/TramFront';
import colors from '../../theme/colors';

export type TransportationIconProps = {
  mode: LegMode;
  isLive?: boolean;
  height?: number;
};

export default function TransportationIcon({
  mode,
  isLive,
  height,
}: TransportationIconProps) {
  const styles = useStyle();
  if (!isLive) {
    return (
      <EmptyCircle>
        <InnerIcon mode={mode} />
      </EmptyCircle>
    );
  }

  return (
    <View
      style={[styles.container, height ? {height, width: height} : undefined]}
    >
      <LottieView source={require('./realtime-animation.json')} autoPlay loop />
      <InnerIcon mode={mode} />
    </View>
  );
}

const EmptyCircle: React.FC = ({children}) => {
  const styles = useStyle();
  return <View style={styles.emptyCircle}>{children}</View>;
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    margin: 6,
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: colors.primary.green,
  },
}));
