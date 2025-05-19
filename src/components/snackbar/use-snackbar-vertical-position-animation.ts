import {useEffect, useRef, useState} from 'react';
import {Animated, Easing, LayoutChangeEvent} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {shadows} from '@atb/modules/map';
import {SnackbarPosition} from '@atb/components/snackbar';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useThemeContext} from '@atb/theme';

export const snackbarAnimationDurationMS = 300; // 0.3 seconds

export const useSnackbarVerticalPositionAnimation = (
  position: SnackbarPosition,
  snackbarIsVisible: boolean,
) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const {theme} = useThemeContext();
  const withSnackbarPadding = (safeAreaHeight: number) =>
    Math.max(safeAreaHeight, theme.spacing.medium) + theme.spacing.small;

  const {top: safeAreaTop, bottom: safeAreaBottom} = useSafeAreaInsets();
  const top = withSnackbarPadding(safeAreaTop);
  const bottom = withSnackbarPadding(safeAreaBottom);

  // height of the Animated.View component in Snackbar
  const [height, setHeight] = useState<number>(55);
  // 55 is just an estimate, use onLayout to measure exact height
  const animatedViewOnLayout = ({nativeEvent}: LayoutChangeEvent) => {
    setHeight(nativeEvent.layout.height);
  };

  // height of a custom view in Snackbar with position absolute and height 100%
  const [parentHeight, setParentHeight] = useState<number>(9999999);
  const parentMeasurerOnLayout = ({nativeEvent}: LayoutChangeEvent) => {
    setParentHeight(nativeEvent.layout.height);
  };

  // When the height of the Snackbar changes, it takes some time to animate into the new hiddenY.
  // To avoid the new pixels being shown on screen until the new hiddenY has been reached while disabled,
  // this uses bottom for position="top" and top for position="bottom"
  const topOrBottomStyle =
    position === 'top'
      ? {bottom: parentHeight - top}
      : {top: parentHeight - bottom};

  const shadowRadius = shadows?.shadowRadius || 8;
  const estimatedShadowHeight = 2 * shadowRadius; // https://drafts.csswg.org/css-backgrounds/#shadow-blur

  const viewHeightIncludingShadow = height + estimatedShadowHeight;

  const shadowOffsetY = Math.min(
    shadows?.shadowOffset?.height || 2,
    estimatedShadowHeight,
  ); // avoid overcompensation by limiting shadowOffsetY to be no more than estimatedShadowHeight

  const visibleY =
    position === 'top' ? viewHeightIncludingShadow : -viewHeightIncludingShadow;

  const hiddenY = isScreenReaderEnabled
    ? visibleY // jump directly to visible position when screen reader enabled
    : position === 'top'
    ? -top - viewHeightIncludingShadow - shadowOffsetY
    : bottom + viewHeightIncludingShadow - shadowOffsetY;

  const translateY = useRef(new Animated.Value(hiddenY)).current;

  useEffect(() => {
    // run animation
    Animated.timing(translateY, {
      toValue: snackbarIsVisible ? visibleY : hiddenY,
      duration: snackbarAnimationDurationMS,
      easing: snackbarIsVisible
        ? Easing.out(Easing.exp)
        : Easing.in(Easing.linear),
      useNativeDriver: true,
    }).start();
  }, [
    snackbarIsVisible,
    translateY,
    position,
    visibleY,
    hiddenY,
    viewHeightIncludingShadow,
  ]);

  return {
    verticalPositionStyle: {
      ...topOrBottomStyle,
      ...{transform: [{translateY}]},
    },
    animatedViewOnLayout,
    parentMeasurerOnLayout,
  };
};
