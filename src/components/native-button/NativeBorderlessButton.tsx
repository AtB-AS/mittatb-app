import {
  BorderlessButton,
  BorderlessButtonProps,
} from 'react-native-gesture-handler';
import React, {forwardRef} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';

export type NativeBorderlessButtonProps = {disabled?: boolean} & Omit<
  BorderlessButtonProps,
  'enabled'
>;

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
      <BorderlessButton
        ref={focusRef}
        {...pressableProps}
        accessible
        enabled={!disabled}
        onPress={(e) => {
          pressableProps.onPress?.(e);
          if (pressableProps.testID) {
            logEvent('OnPress event', pressableProps.testID);
          }
        }}
        style={[disabled ? {opacity: 0.2} : undefined, style]}
        activeOpacity={0.2}
        rippleRadius={30}
        foreground={true}
      >
        {pressableProps?.children}
      </BorderlessButton>
    );
  },
);
