import React, {useMemo} from 'react';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import Animated, {
  cond,
  Extrapolate,
  greaterOrEq,
  interpolate,
} from 'react-native-reanimated';
import {TouchableWithoutFeedback} from 'react-native';
import colors from '@atb/theme/colors';

const AnimatedTouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback,
);

const getBackdrop = (onClose: () => void) => ({
  animatedIndex,
  style,
}: BottomSheetBackdropProps) => {
  // animated variables
  const animatedOpacity = useMemo(
    () =>
      interpolate(animatedIndex, {
        inputRange: [0, 1],
        outputRange: [0, 0.2],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedIndex],
  );

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: '#000000',
        opacity: animatedOpacity,
      },
    ],
    [style, animatedOpacity],
  );

  const isOpenCond = greaterOrEq(animatedIndex, 0.5);
  const pointerEvents = cond(isOpenCond, 'box-only', 'box-none');
  const accessibleElementsHidden = cond(isOpenCond, false, true);

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View
        style={containerStyle}
        pointerEvents={pointerEvents}
        accessible={false}
        accessibilityElementsHidden={accessibleElementsHidden}
        importantForAccessibility={
          accessibleElementsHidden ? 'no-hide-descendants' : 'yes'
        }
        accessibilityLabel={'Background'} // Todo: Texts files
        accessibilityHint={'Active to close'}
      />
    </TouchableWithoutFeedback>
  );
};

export default getBackdrop;
