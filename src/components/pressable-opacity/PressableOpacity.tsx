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
  style?: StyleProp<ViewStyle>;
} & PressableProps;

export const PressableOpacity = forwardRef<any, PressableOpacityProps>(
  (
    {containerStyle, style, ...pressableProps}: PressableOpacityProps,
    focusRef,
  ) => {
    const {fadeIn, fadeOut, opacityValue} = useAnimation();

    return (
      <Pressable
        onPressIn={fadeIn}
        onPressOut={fadeOut}
        ref={focusRef}
        {...pressableProps}
        style={containerStyle}
      >
        <Animated.View style={[{opacity: opacityValue}, style]}>
          {pressableProps?.children}
        </Animated.View>
      </Pressable>
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
