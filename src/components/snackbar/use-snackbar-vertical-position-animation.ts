import {useEffect, useRef, useState} from 'react';
import {Animated, Easing, LayoutChangeEvent} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {shadows} from '@atb/components/map';
import {SnackbarPosition} from '@atb/components/snackbar';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useTheme} from '@atb/theme';

export const snackbarAnimationDurationMS = 300; // 0.3 seconds

export const useSnackbarVerticalPositionAnimation = (
  position: SnackbarPosition,
  snackbarIsVisible: boolean,
) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

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

  const translateY = useRef(new Animated.Value(hiddenY)).current;

  const [isInHiddenY, setIsInHiddenY] = useState(!snackbarIsVisible);

  useEffect(() => {
    // run animation
    setIsInHiddenY(false);
    Animated.timing(translateY, {
      toValue: snackbarIsVisible ? visibleY : hiddenY,
      duration: snackbarAnimationDurationMS,
      easing: snackbarIsVisible
        ? Easing.out(Easing.exp)
        : Easing.in(Easing.linear),
      useNativeDriver: true,
    }).start(({finished}) => finished && setIsInHiddenY(!snackbarIsVisible));
  }, [
    snackbarIsVisible,
    translateY,
    position,
    hiddenY,
    viewHeightIncludingShadow,
  ]);

  // when the Snackbar is disabled, and textContent changes to make the Snackbar taller,
  // it takes a moment for it to move into the new hiddenY,
  // however the Snackbar should not be visible during this transition.
  // isHidden remains true during this transition.
  const [isHidden, setIsHidden] = useState(!snackbarIsVisible);
  useEffect(() => {
    if (snackbarIsVisible) {
      setIsHidden(false);
    } else if (isInHiddenY) {
      setIsHidden(true);
    }
  }, [snackbarIsVisible, isInHiddenY]);

  return {
    verticalPositionStyle: {
      ...topOrBottomStyle,
      ...{transform: [{translateY}]},
      ...(isHidden && {opacity: 0}),
    },
    animatedViewOnLayout,
  };
};
