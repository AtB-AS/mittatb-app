import {RectButton, RectButtonProps} from 'react-native-gesture-handler';
import React, {forwardRef} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';

export type NativeButtonProps = {disabled?: boolean} & Omit<
  RectButtonProps,
  'enabled'
>;

export const NativeButton = forwardRef<any, NativeButtonProps>(
  ({disabled, ...pressableProps}: NativeButtonProps, focusRef) => {
    const {logEvent} = useAnalyticsContext();
    return (
      <RectButton
        ref={focusRef}
        {...pressableProps}
        enabled={!disabled}
        onPress={(e) => {
          pressableProps.onPress?.(e);
          if (pressableProps.testID) {
            logEvent('OnPress event', pressableProps.testID);
          }
        }}
        activeOpacity={0.2}
      >
        {pressableProps?.children}
      </RectButton>
    );
  },
);
