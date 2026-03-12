import {RectButton, RectButtonProps} from 'react-native-gesture-handler';
import React, {forwardRef} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';

export type NativeBlockButtonProps = {disabled?: boolean} & Omit<
  RectButtonProps,
  'enabled'
>;

export const NativeBlockButton = forwardRef<any, NativeBlockButtonProps>(
  ({disabled, style, ...pressableProps}: NativeBlockButtonProps, focusRef) => {
    // Yep, this is a hack. backgroundColor is a prop that is not officially supported by the RectButton component.
    // But if you send it in, it will be applied to the button, and cannot be changed later
    // @ts-ignore
    delete pressableProps.backgroundColor;

    const {logEvent} = useAnalyticsContext();
    return (
      <RectButton
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
      >
        {pressableProps?.children}
      </RectButton>
    );
  },
);
