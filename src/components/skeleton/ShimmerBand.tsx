import React, {useEffect} from 'react';
import {Animated, Easing, useWindowDimensions, View} from 'react-native';
import {StyleSheet} from '@atb/theme';

const SWEEP_DURATION = 1600;
const BAND_WIDTH = 140;
const PEAK_OPACITY = 0.3;
// Vertical stripes across the band, opacity ramped in a triangle (0 at the
// edges, PEAK_OPACITY in the middle) to give a soft gradient.
const STRIPE_COUNT = 12;
const STRIPE_OPACITIES = Array.from({length: STRIPE_COUNT}, (_, i) => {
  const t = i / (STRIPE_COUNT - 1); // 0..1 across the band
  return (1 - Math.abs(t - 0.5) * 2) * PEAK_OPACITY;
});

// One shared sweep progress (0 -> 1, repeating) for every skeleton on screen.
// Started on the first mount and stopped when the last unmounts, so a single
// native-driven timeline runs no matter how many skeletons are visible.
const progress = new Animated.Value(0);
let animation: Animated.CompositeAnimation | undefined;
let activeConsumers = 0;
const acquireShimmer = () => {
  if (activeConsumers === 0) {
    progress.setValue(0);
    animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: SWEEP_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
  }
  activeConsumers++;
};
const releaseShimmer = () => {
  activeConsumers--;
  if (activeConsumers <= 0) {
    activeConsumers = 0;
    animation?.stop();
    animation = undefined;
    progress.setValue(0);
  }
};

type Props = {
  /** Highlight color swept across the content. Defaults to white. */
  highlightColor?: string;
};

/**
 * The sweeping highlight band shared by every `Skeleton`. Rendered as an
 * absolutely-positioned overlay clipped by the enclosing Skeleton, so every
 * band on screen shares a single native-driven sweep.
 */
export const ShimmerBand = ({highlightColor = 'white'}: Props) => {
  const styles = useStyles();
  const {width} = useWindowDimensions();

  useEffect(() => {
    acquireShimmer();
    return releaseShimmer;
  }, []);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-BAND_WIDTH, width + BAND_WIDTH],
  });

  return (
    <Animated.View
      style={[styles.band, {transform: [{translateX}]}]}
      pointerEvents="none"
      aria-hidden={true}
    >
      {STRIPE_OPACITIES.map((opacity, i) => (
        <View
          key={i}
          style={[styles.stripe, {opacity, backgroundColor: highlightColor}]}
        />
      ))}
    </Animated.View>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: BAND_WIDTH,
    flexDirection: 'row',
  },
  stripe: {
    flex: 1,
    height: '100%',
  },
}));
