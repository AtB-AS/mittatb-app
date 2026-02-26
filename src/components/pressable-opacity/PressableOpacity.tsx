import {RectButton, RectButtonProps} from 'react-native-gesture-handler';
import React, {forwardRef} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';

export type PressableOpacityProps = {disabled?: boolean} & RectButtonProps;

export const PressableOpacity = forwardRef<any, PressableOpacityProps>(
  ({...pressableProps}: PressableOpacityProps, focusRef) => {
    const {logEvent} = useAnalyticsContext();
    return (
      <RectButton
        ref={focusRef}
        {...pressableProps}
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
