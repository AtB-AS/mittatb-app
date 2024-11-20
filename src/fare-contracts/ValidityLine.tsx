import React, {ReactElement, useEffect, useRef} from 'react';
import {Animated, Dimensions, Easing, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import LinearGradient from 'react-native-linear-gradient';
import {ValidityStatus} from '@atb/fare-contracts/utils';
import {SectionSeparator} from '@atb/components/sections';
import {useValidityLineColors} from './use-validity-line-colors';
import {useMobileTokenContextState} from '@atb/mobile-token';

const SPACE_BETWEEN_VERTICAL_LINES = 72;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type Props =
  | {
      status: 'valid';
      now: number;
      validFrom: number;
      validTo: number;
      fareProductType?: string;
      animate?: boolean;
    }
  | {status: Exclude<ValidityStatus, 'valid'>};

export const ValidityLine = (props: Props): ReactElement => {
  const {status} = props;

  const {theme} = useTheme();
  const styles = useStyles();
  const {lineColor, backgroundColor} = useValidityLineColors(
    status === 'valid' ? props.fareProductType : undefined,
  );
  const {isInspectable} = useMobileTokenContextState();

  switch (status) {
    case 'reserving':
    case 'approved':
      return (
        <LineWithVerticalBars
          backgroundColor={theme.color.background.accent[3].background}
          lineColor={lineColor}
        />
      );
    case 'valid':
      const {now, validFrom, validTo, animate = true} = props;
      const validityPercent = animate
        ? getValidityPercent(now, validFrom, validTo)
        : 100;

      return isInspectable ? (
        <LineWithVerticalBars
          backgroundColor={backgroundColor.background}
          lineColor={lineColor}
          validityPercent={validityPercent}
          animate={animate}
        />
      ) : (
        <View style={styles.container}>
          <SectionSeparator />
        </View>
      );
    case 'upcoming':
    case 'refunded':
    case 'expired':
    case 'inactive':
    case 'rejected':
    case 'cancelled':
    case 'sent':
      return (
        <View style={styles.container}>
          <SectionSeparator />
        </View>
      );
  }
};

const LineWithVerticalBars = ({
  backgroundColor,
  lineColor,
  validityPercent = 100,
  animate = true,
}: {
  backgroundColor: string;
  lineColor: string;
  validityPercent?: number;
  animate?: boolean;
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const animatedVerticalLineOffset = useAnimatedVerticalLineOffset(animate);
  const numberOfVerticalLines = getNumberOfVerticalLines();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progressBar,
          {
            width: `${validityPercent}%`,
            backgroundColor,
          },
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
      <View
        style={{
          width: `${100 - validityPercent}%`,
          backgroundColor: theme.color.background.neutral[1].background,
        }}
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
const useAnimatedVerticalLineOffset = (animate: boolean | undefined = true) => {
  const animatedOffset = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animate) return;
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
 * Calculates the validity percent based on time left on ticket. This value is
 * used for determining how wide the animated part of the progress bar should
 * be. The returned validity percent will never be below 5 as the progress bar
 * need to be wide enough to always show some animation.
 */
const getValidityPercent = (
  now: number,
  validFrom: number,
  validTo: number,
) => {
  const duration = validTo - validFrom;
  const timeLeft = validTo - now;
  const percent = Math.ceil((timeLeft / duration) * 100);
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
const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginVertical: theme.spacing.medium,
    marginHorizontal: -theme.spacing.medium,
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
