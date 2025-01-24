import React, {ReactElement, useEffect, useRef} from 'react';
import {Animated, Dimensions, Easing, View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import LinearGradient from 'react-native-linear-gradient';
import {ValidityStatus} from '@atb/fare-contracts/utils';
import {SectionSeparator} from '@atb/components/sections';
import {useValidityLineColors} from './use-validity-line-colors';
import {useMobileTokenContext} from '@atb/mobile-token';

const SPACE_BETWEEN_VERTICAL_LINES = 72;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type Props =
  | {
      status: 'valid';
      fareProductType?: string;
      animate?: boolean;
    }
  | {status: Exclude<ValidityStatus, 'valid'>};

export const ValidityLine = (props: Props): ReactElement => {
  const {status} = props;

  const {theme} = useThemeContext();

  const styles = useStyles();
  const {lineColor, backgroundColor} = useValidityLineColors(
    status === 'valid' ? props.fareProductType : undefined,
  );
  const {isInspectable} = useMobileTokenContext();

  switch (status) {
    case 'reserving':
      return (
        <LineWithVerticalBars
          backgroundColor={theme.color.foreground.dynamic.disabled}
          lineColor={lineColor}
        />
      );
    case 'approved':
      return (
        <LineWithVerticalBars
          backgroundColor={theme.color.interactive[0].default.background}
          lineColor={lineColor}
        />
      );
    case 'valid':
      return isInspectable ? (
        <LineWithVerticalBars
          backgroundColor={backgroundColor.background}
          lineColor={lineColor}
          animate={props.animate}
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
  animate = true,
}: {
  backgroundColor: string;
  lineColor: string;
  animate?: boolean;
}) => {
  const styles = useStyles();
  const animatedVerticalLineOffset = useAnimatedVerticalLineOffset(animate);
  const numberOfVerticalLines = getNumberOfVerticalLines();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progressBar,
          {
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
    width: '100%',
    overflow: 'hidden',
  },
  verticalLine: {
    position: 'absolute',
    bottom: 0,
    width: 16,
    height: '100%',
  },
}));
