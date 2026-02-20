import {Pressable, PressableProps} from 'react-native-gesture-handler';
import {PressableEvent} from 'react-native-gesture-handler/lib/typescript/components/Pressable/PressableProps';
import {StyleProp, ViewStyle} from 'react-native';
import React, {forwardRef} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';

export type PressableOpacityProps = {
  style?: StyleProp<ViewStyle>;
} & PressableProps;

export type PressableOpacityEvent = PressableEvent;

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
