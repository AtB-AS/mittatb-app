import {StyleSheet, useThemeContext} from '@atb/theme';
import {useEffect} from 'react';
import {StyleProp, ViewStyle, Dimensions, View} from 'react-native';
import {Canvas, Circle, Group, Line, SkPoint} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';

const SPACE_BETWEEN_VERTICAL_LINES = 72;

export const LineWithVerticalBars = ({
  backgroundColor,
  animate = true,
  style,
}: {
  backgroundColor: string;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const animatedVerticalLineOffset = useAnimatedVerticalLineOffset(animate);
  const numberOfVerticalLines = getNumberOfVerticalLines();
  const lineColor = theme.color.background.neutral[0].background;
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progressBar,
          {
            backgroundColor,
          },
          style,
        ]}
      >
        <Canvas style={{width: '100%', height: 50}}>
          <Group blendMode="multiply">
            {[...Array(numberOfVerticalLines)].map((e, i) => (
              <VerticalLine
                key={i}
                offset={animatedVerticalLineOffset}
                index={i}
                color={lineColor}
              />
            ))}
          </Group>
        </Canvas>
      </View>
    </View>
  );
};

/**
 * Starts an animation for the vertical line offset which loops continuously.
 * The offset is animated from 0 to 1, which must be interpolated to the actual
 * pixel offset value in the vertical line component.
 * @returns the current animated offset value
 */
const useAnimatedVerticalLineOffset = (animate: boolean | undefined = true) => {
  const animatedOffset = useSharedValue(0);
  useEffect(() => {
    if (!animate) {
      animatedOffset.value = 0;
      return;
    }
    animatedOffset.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [animate, animatedOffset]);
  return animatedOffset;
};

/**
 Get the number of vertical lines necessary to fill the progress bar. For
 simplicity's sake it is calculated by using the window viewport width instead
 of actual progress bar width. I found using the onLayout listener to calculate
 the actual progress bar width was not worth the effort as some overflowing
 hidden vertical lines doesn't hurt anybody.
 */
const getNumberOfVerticalLines = () =>
  Math.ceil(Dimensions.get('window').width / SPACE_BETWEEN_VERTICAL_LINES);

const VerticalLine = ({
  offset,
  index,
  color,
}: {
  offset: SharedValue<number>;
  index: number;
  color: string;
}) => {
  const p1 = useDerivedValue<SkPoint>(() => ({
    x:
      interpolate(offset.value, [0, 1], [SPACE_BETWEEN_VERTICAL_LINES, 0]) +
      index * SPACE_BETWEEN_VERTICAL_LINES -
      10,
    y: -10,
  }));
  const p2 = useDerivedValue<SkPoint>(() => ({
    x:
      interpolate(offset.value, [0, 1], [SPACE_BETWEEN_VERTICAL_LINES, 0]) +
      index * SPACE_BETWEEN_VERTICAL_LINES +
      20,
    y: 30,
  }));
  return <Line p1={p1} p2={p2} strokeWidth={10} color={color} />;
};
const useStyles = StyleSheet.createThemeHook(() => ({
  container: {
    flexDirection: 'row',
  },
  progressBar: {
    height: 12,
    // Make the animation slightly larger than the view to avoid glitches along
    // the edges.
    width: '104%',
    marginLeft: '-2%',
    overflow: 'hidden',
  },
  verticalLine: {
    position: 'absolute',
    bottom: -5,
    width: 13,
    height: 25,
  },
}));
