import {Touchable, TouchableProps} from 'react-native-gesture-handler';
import React, {forwardRef} from 'react';
import {Platform} from 'react-native';
import {useAnalyticsContext} from '@atb/modules/analytics';

export type NativeTouchableVariant = 'block' | 'borderless';

export type NativeTouchableProps = {
  variant: NativeTouchableVariant;
} & TouchableProps;

const feedbackProps: Record<NativeTouchableVariant, TouchableProps> = {
  block: {
    underlayColor: 'black',
    activeUnderlayOpacity: Platform.OS === 'ios' ? 0.2 : 0,
    androidRipple: {},
  },
  borderless: {
    activeOpacity: Platform.OS === 'ios' ? 0.2 : 1,
    androidRipple: {borderless: true, radius: 30, foreground: true},
  },
};

export const NativeTouchable = forwardRef<any, NativeTouchableProps>(
  (
    {variant, disabled, style, ...pressableProps}: NativeTouchableProps,
    focusRef,
  ) => {
    if (variant === 'block') {
      // Yep, this is a hack. backgroundColor is a prop that is not officially supported by the Touchable component.
      // But if you send it in, it will be applied to the button, and cannot be changed later
      // @ts-ignore
      delete pressableProps.backgroundColor;
    }

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
        {...feedbackProps[variant]}
      >
        {pressableProps?.children}
      </Touchable>
    );
  },
);
