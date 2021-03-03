import React, {useMemo} from 'react';
import {BottomSheetBackdropProps, useBottomSheet} from '@gorhom/bottom-sheet';
import Animated, {
  cond,
  lessThan,
  Extrapolate,
  interpolate,
} from 'react-native-reanimated';
import {TouchableWithoutFeedback} from 'react-native';

const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback,
);

const CustomBackdrop = ({animatedIndex, style}: BottomSheetBackdropProps) => {
  const {close} = useBottomSheet();

  // animated variables
  const animatedOpacity = useMemo(
    () =>
      interpolate(animatedIndex, {
        inputRange: [0, 1],
        outputRange: [0, 0.7],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedIndex],
  );

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: '#a8b5eb',
        opacity: animatedOpacity,
      },
    ],
    [style, animatedOpacity],
  );

  const pointerEvents = cond(
    lessThan(animatedIndex, 0.5),
    'box-none',
    'box-only',
  );

  return (
    <TouchableWithoutFeedback onPress={close}>
      <Animated.View
        style={containerStyle}
        pointerEvents={pointerEvents}
        accessible={false}
      />
    </TouchableWithoutFeedback>
  );
};

export default CustomBackdrop;
