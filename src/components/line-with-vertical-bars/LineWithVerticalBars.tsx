import {StyleSheet, useThemeContext} from '@atb/theme';
import {useEffect, useRef} from 'react';
import {
  StyleProp,
  ViewStyle,
  Animated,
  Easing,
  Dimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SPACE_BETWEEN_VERTICAL_LINES = 72;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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
        {[...Array(numberOfVerticalLines)].map((e, i) => (
          <VerticalLine
            key={i}
            offset={animatedVerticalLineOffset}
            index={i}
            color={lineColor}
          />
        ))}
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
  const animatedOffset = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animate) return animatedOffset.stopAnimation();
    return Animated.loop(
      Animated.timing(animatedOffset, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
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
  offset: Animated.Value;
  index: number;
  color: string;
}) => {
  return (
    <AnimatedLinearGradient
      style={[
        useStyles().verticalLine,
        {
          left: index * SPACE_BETWEEN_VERTICAL_LINES - 10,
          transform: [
            {
              translateX: offset.interpolate({
                inputRange: [0, 1],
                outputRange: [SPACE_BETWEEN_VERTICAL_LINES, 0],
              }),
            },
          ],
        },
      ]}
      useAngle={true}
      angle={120}
      locations={[0.25, 0.25, 0.75, 0.75]}
      colors={['transparent', color, color, 'transparent']}
      pointerEvents="none"
    />
  );
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
    bottom: 0,
    width: 20,
    height: '100%',
  },
}));
