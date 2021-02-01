import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, Easing, View} from 'react-native';
import Dash from 'react-native-dash';
import {StyleSheet, useTheme} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../theme/colors';

const SPACE_BETWEEN_VERTICAL_LINES = 72;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type Props =
  | {
      status: 'valid';
      nowSeconds: number;
      validFrom: number;
      validTo: number;
    }
  | {
      status: 'reserving';
      nowSeconds?: never;
      validFrom?: never;
      validTo?: never;
    }
  | {
      status: 'expired';
      nowSeconds?: never;
      validFrom?: never;
      validTo?: never;
    };

const ValidityLine = (props: Props) => {
  const {theme} = useTheme();
  const styles = useStyles();

  if (props.status === 'reserving') {
    return <LineWithVerticalBars status={props.status} />;
  } else if (props.status === 'valid') {
    const {nowSeconds, validFrom, validTo} = props;
    const validityPercent = getValidityPercent(nowSeconds, validFrom, validTo);
    return (
      <LineWithVerticalBars
        status={props.status}
        validityPercent={validityPercent}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <Dash
          style={{width: '100%'}}
          dashGap={0}
          dashLength={1}
          dashThickness={1}
          dashColor={theme.background.level1}
        />
      </View>
    );
  }
};

const LineWithVerticalBars = ({
  status,
  validityPercent = 100,
}: {
  status: 'valid' | 'reserving';
  validityPercent?: number;
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const animatedVerticalLineOffset = useAnimatedVerticalLineOffset();
  const numberOfVerticalLines = getNumberOfVerticalLines();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progressBar,
          {width: `${validityPercent}%`},
          {
            backgroundColor:
              status === 'valid'
                ? colors.primary.green_500
                : colors.secondary.cyan_500,
          },
        ]}
      >
        {[...Array(numberOfVerticalLines)].map((e, i) => (
          <VerticalLine key={i} offset={animatedVerticalLineOffset} index={i} />
        ))}
      </View>
      <Dash
        style={{width: `${100 - validityPercent}%`}}
        dashGap={0}
        dashLength={1}
        dashThickness={8}
        dashColor={theme.background.level1}
      />
    </View>
  );
};

/**
 * Starts an animation for the vertical line offset which loops continuously.
 * The offset is animated from 0 to 1, which must be interpolated to the actual
 * pixel offset value in the vertical line component.
 * @returns the current animated offset value
 */
const useAnimatedVerticalLineOffset = () => {
  const animatedOffset = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    return Animated.loop(
      Animated.timing(animatedOffset, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, []);
  return animatedOffset;
};

/**
 * Calculates the validity percent based on time left on ticket. This value is
 * used for determining how wide the animated part of the progress bar should
 * be. The returned validity percent will never be below 5 as the progress bar
 * need to be wide enough to always show some animation.
 */
const getValidityPercent = (
  nowSeconds: number,
  validFrom: number,
  validTo: number,
) => {
  const durationSeconds = validTo - validFrom;
  const timeLeftSeconds = validTo - nowSeconds;
  const percent = Math.ceil((timeLeftSeconds / durationSeconds) * 100);
  return Math.max(5, Math.min(percent, 100));
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
}: {
  offset: Animated.Value;
  index: number;
}) => (
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
    colors={[
      'transparent',
      colors.primary.gray_500,
      colors.primary.gray_500,
      'transparent',
    ]}
    pointerEvents={'none'}
  />
);

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginVertical: theme.spacings.medium,
    marginHorizontal: -theme.spacings.medium,
    flexDirection: 'row',
  },
  progressBar: {
    height: 8,
    overflow: 'hidden',
  },
  verticalLine: {
    position: 'absolute',
    bottom: 0,
    width: 12,
    height: '100%',
  },
}));

export default ValidityLine;
