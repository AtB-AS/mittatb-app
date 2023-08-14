import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {forwardRef} from 'react';

type PressableOpacityProps = {
  containerStyle?: StyleProp<ViewStyle>;
} & PressableProps;

export const PressableOpacity = forwardRef<any, PressableOpacityProps>(
  ({containerStyle, ...pressableProps}: PressableOpacityProps, focusRef) => {
    const {fadeIn, fadeOut, opacityValue} = useAnimation();

    return (
      <Animated.View style={[{opacity: opacityValue}, containerStyle]}>
        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          ref={focusRef}
          {...pressableProps}
        >
          {pressableProps?.children}
        </Pressable>
      </Animated.View>
    );
  },
);

function useAnimation() {
  const opacityValue = React.useRef(new Animated.Value(1)).current;
  const fadeIn = () => {
    Animated.timing(opacityValue, {
      toValue: 0.1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  return {fadeIn, fadeOut, opacityValue};
}
