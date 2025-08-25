import {Pressable, PressableProps, StyleProp, ViewStyle} from 'react-native';
import React, {forwardRef} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';

export type PressableOpacityProps = {
  style?: StyleProp<ViewStyle>;
} & PressableProps;

export const PressableOpacity = forwardRef<any, PressableOpacityProps>(
  ({style, ...pressableProps}: PressableOpacityProps, focusRef) => {
    const {logEvent} = useAnalyticsContext();
    return (
      <Pressable
        ref={focusRef}
        style={({pressed}) => [{opacity: pressed ? 0.2 : 1}, style]}
        {...pressableProps}
        onPress={(e) => {
          pressableProps.onPress?.(e);
          if (pressableProps.testID) {
            logEvent('OnPress event', pressableProps.testID);
          }
        }}
      >
        {pressableProps?.children}
      </Pressable>
    );
  },
);
