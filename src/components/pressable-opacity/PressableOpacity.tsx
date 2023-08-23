import {Pressable, PressableProps, StyleProp, ViewStyle} from 'react-native';
import React, {forwardRef} from 'react';

type PressableOpacityProps = {
  style?: StyleProp<ViewStyle>;
} & PressableProps;

export const PressableOpacity = forwardRef<any, PressableOpacityProps>(
  ({style, ...pressableProps}: PressableOpacityProps, focusRef) => {
    return (
      <Pressable
        ref={focusRef}
        style={({pressed}) => [{opacity: pressed ? 0.1 : 1}, style]}
        {...pressableProps}
      >
        {pressableProps?.children}
      </Pressable>
    );
  },
);
