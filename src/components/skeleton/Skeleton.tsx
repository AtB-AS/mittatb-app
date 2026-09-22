import React, {PropsWithChildren, useEffect} from 'react';
import {
  StyleProp,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  makeMutable,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {StyleSheet} from '@atb/theme';

const SWEEP_DURATION = 1600;
const BAND_WIDTH = 140;

// One shared sweep progress (0 -> 1, repeating) for every skeleton on screen.
// Started on the first mount and cancelled when the last unmounts, so a single
// timeline runs on the UI thread no matter how many skeletons are visible.
const progress = makeMutable(0);
let activeConsumers = 0;
const acquireShimmer = () => {
  if (activeConsumers === 0) {
    progress.value = withRepeat(
      withTiming(1, {duration: SWEEP_DURATION, easing: Easing.linear}),
      -1,
      false,
    );
  }
  activeConsumers++;
};
const releaseShimmer = () => {
  activeConsumers--;
  if (activeConsumers <= 0) {
    activeConsumers = 0;
    cancelAnimation(progress);
    progress.value = 0;
  }
};

type Props = PropsWithChildren<
  ViewProps & {
    style?: StyleProp<ViewStyle>;
    /** Highlight color swept across the content. Defaults to white. */
    highlightColor?: string;
  }
>;

/**
 * A shimmering skeleton placeholder shown while content loads.
 *
 * - With no children it renders a single shimmering block shaped by `style` —
 *   the common one-import case.
 * - With children it sweeps a single shared shimmer across whatever you compose
 *   inside (e.g. `SkeletonBlock` shapes), for building richer skeletons.
 *
 * Every Skeleton on screen shares a single animation timeline running on the
 * UI thread, so adding more skeletons doesn't add more animations to drive.
 */
export const Skeleton = ({
  children,
  style,
  highlightColor = 'white',
  ...viewProps
}: Props) => {
  const styles = useStyles();
  const {width} = useWindowDimensions();

  useEffect(() => {
    acquireShimmer();
    return releaseShimmer;
  }, []);

  const bandStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: -BAND_WIDTH + progress.value * (width + BAND_WIDTH)},
    ],
  }));

  return (
    <View
      style={[styles.container, !children && styles.block, style]}
      {...viewProps}
    >
      {children}
      <Animated.View
        style={[styles.band, bandStyle]}
        pointerEvents="none"
        aria-hidden={true}
      >
        <Svg width={BAND_WIDTH} height="100%">
          <Defs>
            <LinearGradient id="skeletonShimmer" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={highlightColor} stopOpacity="0" />
              <Stop offset="0.5" stopColor={highlightColor} stopOpacity="0.3" />
              <Stop offset="1" stopColor={highlightColor} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect width={BAND_WIDTH} height="100%" fill="url(#skeletonShimmer)" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    overflow: 'hidden',
  },
  // Applied only when the Skeleton is a standalone block (no children).
  block: {
    backgroundColor: theme.color.background.neutral[3].background,
  },
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: BAND_WIDTH,
  },
}));
