import {Touchable, TouchableProps} from 'react-native-gesture-handler';
import React, {forwardRef} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';

export type NativeBorderlessButtonProps = TouchableProps;

export const NativeBorderlessButton = forwardRef<
  any,
  NativeBorderlessButtonProps
>(
  (
    {disabled, style, ...pressableProps}: NativeBorderlessButtonProps,
    focusRef,
  ) => {
    const {logEvent} = useAnalyticsContext();
    return (
      <Touchable
        ref={focusRef}
        {...pressableProps}
        accessible
        disabled={disabled}
        onPress={(e) => {
          pressableProps.onPress?.(e);
          if (pressableProps.testID) {
            logEvent('OnPress event', pressableProps.testID);
          }
        }}
        style={[disabled ? {opacity: 0.2} : undefined, style]}
        activeOpacity={0.2}
        androidRipple={{borderless: true, radius: 30, foreground: true}}
      >
        {pressableProps?.children}
      </Touchable>
    );
  },
);
