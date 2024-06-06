import {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, LayoutChangeEvent, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {shadows} from '@atb/components/map';
import {SnackbarPosition} from '@atb/components/snackbar';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useTheme} from '@atb/theme';

export const snackbarAnimationDurationMS = 300; // 0.3 seconds

export const useSnackbarVerticalPositionAnimation = (
  position: SnackbarPosition,
  snackbarShouldBeVisible: boolean,
) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const [snackbarIsVisible, setSnackbarIsVisible] = useState(false);

  const {theme} = useTheme();
  const withSnackbarPadding = (safeAreaHeight: number) =>
    Math.max(safeAreaHeight, theme.spacings.medium) + theme.spacings.small;

  const {top: safeAreaTop, bottom: safeAreaBottom} = useSafeAreaInsets();
  const top = withSnackbarPadding(safeAreaTop);
  const bottom = withSnackbarPadding(safeAreaBottom);

  // the y position when visible and the animation is done
  const topOrBottomStyle = position === 'top' ? {top} : {bottom};

  // height of the Animated.View component in Snackbar
  const [height, setHeight] = useState<number>(55);
  // 55 is just an estimate, use onLayout to measure exact height
  const animatedViewOnLayout = ({nativeEvent}: LayoutChangeEvent) => {
    setHeight(nativeEvent.layout.height);
  };

  const visibleY = 0; // no offset

  const shadowRadius = shadows?.shadowRadius || 8;
  const estimatedShadowHeight = 2 * shadowRadius; // https://drafts.csswg.org/css-backgrounds/#shadow-blur

  const viewHeightIncludingShadow = height + estimatedShadowHeight;

  const shadowOffsetY = Math.min(
    shadows?.shadowOffset?.height || 2,
    estimatedShadowHeight,
  ); // avoid overcompensation by limiting shadowOffsetY to be no more than estimatedShadowHeight

  const hiddenY = isScreenReaderEnabled
    ? visibleY // jump directly to visible position when screen reader enabled
    : position === 'top'
    ? -top - viewHeightIncludingShadow - shadowOffsetY
    : bottom + viewHeightIncludingShadow - shadowOffsetY;

  const translateYRef = useRef(new Animated.Value(hiddenY));

  const animateIn = useCallback(() => {
    Animated.timing(translateYRef.current, {
      toValue: visibleY,
      duration: snackbarAnimationDurationMS,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(({finished}) => {
      finished && setSnackbarIsVisible(true);
    });
  }, []);

  const animateOut = useCallback(() => {
    Animated.timing(translateYRef.current, {
      toValue: hiddenY,
      duration: snackbarAnimationDurationMS,
      easing: Easing.in(Easing.linear),
      useNativeDriver: true,
    }).start(({finished}) => {
      finished && setSnackbarIsVisible(false);
    });
  }, [hiddenY]);

  useEffect(() => {
    // run animation
    if (snackbarShouldBeVisible && !snackbarIsVisible) {
      animateIn();
    } else if (!snackbarShouldBeVisible && snackbarIsVisible) {
      animateOut();
    }
  }, [snackbarShouldBeVisible, snackbarIsVisible, animateIn, animateOut]);

  const isHidden = !snackbarIsVisible && !snackbarShouldBeVisible;

  return {
    verticalPositionStyle: {
      ...topOrBottomStyle,
      ...{transform: [{translateY: translateYRef.current}]},
      ...(isHidden && {
        opacity: 0,
        pointerEvents: 'none' as ViewStyle['pointerEvents'],
      }),
    },
    animatedViewOnLayout,
  };
};
