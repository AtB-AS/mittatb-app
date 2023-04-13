import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Animated, Easing} from 'react-native';
import {Spinner as SpinnerLight} from '@atb/assets/svg/color/icons/status/light';
import {Spinner as SpinnerDark} from '@atb/assets/svg/color/icons/status/dark';
import {useTheme} from '@atb/theme';

export const LoadingSpinner = () => {
  const {themeName} = useTheme();
  const Spinner = themeName === 'dark' ? SpinnerDark : SpinnerLight;
  const spinValue = new Animated.Value(0);
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{transform: [{rotate: spin}]}}>
      <ThemeIcon svg={Spinner} />
    </Animated.View>
  );
};
