import {LegMode} from '../../sdk';
import React from 'react';
import LottieView from 'lottie-react-native';
import {View} from 'react-native';
import {StyleSheet} from '../../theme';
import BusFront from '../../assets/svg/BusFront';
import TramFront from '../../assets/svg/TramFront';

export type TransportationIconProps = {
  mode: LegMode;
  isLive?: boolean;
};

export default function TransportationIcon({
  mode,
  isLive,
}: TransportationIconProps) {
  const styles = useStyle();
  if (!isLive) {
    return <InnerIcon mode={mode} />;
  }

  return (
    <View style={styles.container}>
      <LottieView source={require('./realtime-animation.json')} autoPlay loop />
      <InnerIcon mode={mode} />
    </View>
  );
}

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
}));
