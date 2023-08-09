import {Animated, Pressable, PressableProps} from 'react-native';
import React, {forwardRef} from 'react';

const FADE_IN_ANIMATION_CONFIG = {
  toValue: 0.1,
  duration: 100,
  useNativeDriver: true,
};

const FADE_OUT_ANIMATION_CONFIG = {
  toValue: 1,
  duration: 100,
  useNativeDriver: true,
};

export const PressableOpacity = forwardRef<any, PressableProps>(
  (pressableProps: PressableProps, focusRef) => {
    const {fadeIn, fadeOut, opacityValue} = useAnimation();

    return (
      <Pressable
        onPressIn={fadeIn}
        onPressOut={fadeOut}
        ref={focusRef}
        {...pressableProps}
      >
        <Animated.View style={{opacity: opacityValue}}>
          {pressableProps?.children}
        </Animated.View>
      </Pressable>
    );
  },
);

function useAnimation() {
  const opacityValue = React.useRef(new Animated.Value(1)).current;
  const fadeIn = () => {
    Animated.timing(opacityValue, FADE_IN_ANIMATION_CONFIG).start();
  };
  const fadeOut = () => {
    Animated.timing(opacityValue, FADE_OUT_ANIMATION_CONFIG).start();
  };
  return {fadeIn, fadeOut, opacityValue};
}
