import React, {useEffect} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const PULSE_DURATION = 700;

export const SkeletonBlock = ({
  style,
  delay = 0,
}: {
  style?: StyleProp<ViewStyle>;
  delay?: number;
}) => {
  const styles = useStyles();
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: PULSE_DURATION,
          easing: Easing.inOut(Easing.ease),
          reduceMotion: ReduceMotion.System,
        }),
        -1,
        true,
      ),
    );
  }, [opacity, delay]);

  const animatedStyle = useAnimatedStyle(() => ({opacity: opacity.value}));

  return <Animated.View style={[styles.base, style, animatedStyle]} />;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  base: {
    backgroundColor: theme.color.background.neutral[3].background,
  },
}));
