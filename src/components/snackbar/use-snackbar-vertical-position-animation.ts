import {useEffect, useRef, useState} from 'react';
import {Animated, Easing, LayoutChangeEvent} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {shadows} from '@atb/components/map';
import {SnackbarPosition} from '@atb/components/snackbar';

export const useSnackbarVerticalPositionAnimation = (
  position: SnackbarPosition,
  visible: boolean,
  onDismiss?: () => void,
) => {
  const {top, bottom} = useSafeAreaInsets();

  // the y position when visible and the animation is done
  const topOrBottomStyle = position === 'top' ? {top} : {bottom};

  // height of the Animated.View component in Snackbar
  const [height, setHeight] = useState<number>(55);
  // 55 is just an estimate, use onLayout to measure exact height
  const animatedViewOnLayout = ({nativeEvent}: LayoutChangeEvent) => {
    setHeight(nativeEvent.layout.height);
  };

  // make sure to move it far enough out to also hide the shadow
  const viewHeightIncludingShadow = height + (shadows?.shadowRadius || 8);
  const hiddenY =
    position === 'top'
      ? -top - viewHeightIncludingShadow
      : bottom + viewHeightIncludingShadow;
  const visibleY = 0;

  const translateY = useRef(new Animated.Value(hiddenY)).current;

  useEffect(() => {
    // run animation
    Animated.timing(translateY, {
      toValue: visible ? visibleY : hiddenY,
      duration: 300,
      easing: visible ? Easing.out(Easing.exp) : Easing.in(Easing.linear),
      useNativeDriver: true,
    }).start(() => {
      if (!visible && onDismiss) onDismiss();
    });
  }, [
    visible,
    translateY,
    position,
    onDismiss,
    hiddenY,
    viewHeightIncludingShadow,
  ]);

  return {
    verticalPositionStyle: {
      ...topOrBottomStyle,
      ...{transform: [{translateY}]},
    },
    animatedViewOnLayout,
  };
};
