import {Animated} from 'react-native';
import React, {useMemo} from 'react';
import {StyleSheet} from '@atb/theme';

export function Backdrop({animatedOffset}: {animatedOffset: Animated.Value}) {
  const styles = useStyles();
  const opacity = useMemo(
    () =>
      animatedOffset.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.8],
      }),
    [animatedOffset],
  );

  return (
    <Animated.View
      style={{
        ...styles.backdrop,
        opacity,
      }}
      pointerEvents="box-none"
    />
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  backdrop: {
    //backgroundColor: 'black',
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
}));
