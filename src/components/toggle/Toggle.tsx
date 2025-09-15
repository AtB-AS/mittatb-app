import {useDelayGate} from '@atb/utils/use-delay-gate';
import React, {useEffect, useState} from 'react';
import {AccessibilityProps, Switch, SwitchProps, Platform} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useFontScale} from '@atb/utils/use-font-scale';
import {InteractiveColor} from '@atb/theme/colors';

type Props = Pick<
  SwitchProps,
  'value' | 'onValueChange' | 'testID' | 'disabled'
> & {
  interactiveColor?: InteractiveColor;
} & AccessibilityProps;

// A bug in RN borks Switch animations when Switch is used inside react navigation
// for Android. A small delay to render and setting value through state
// seems to mitigate the bug
export function Toggle({
  value,
  onValueChange,
  interactiveColor,
  ...props
}: Props) {
  const [checked, setChecked] = useState(value);
  const {theme} = useThemeContext();
  const interactiveColorValue = interactiveColor ?? theme.color.interactive[1];
  const backgroundColor = theme.color.background.neutral[3].background;
  const styles = useStyles();

  // Preserve outside changes
  function handleValueChange(value: boolean) {
    setChecked(value);
    onValueChange?.(value);
  }

  useEffect(() => {
    setChecked(value);
  }, [value]);

  const delayRender = useDelayGate(10);

  return delayRender ? (
    <Switch
      value={checked}
      onValueChange={(value) => handleValueChange(value)}
      trackColor={{
        true: interactiveColorValue.outline.background,
        false: backgroundColor,
      }}
      thumbColor="white"
      style={[
        Platform.OS === 'android' ? styles.android : styles.ios,

        // The disabled state is not shown visually on Android by default, so we
        // need to style it manually.
        Platform.OS === 'android' && props.disabled && styles.androidDisabled,

        // Fix for React Native 0.81 Switch component layout issue
        // See: https://github.com/facebook/react-native/issues/53537
        styles.fixedDimensions,
      ]}
      {...props}
      testID={props.testID}
    />
  ) : null;
}

const useStyles = StyleSheet.createThemeHook(() => {
  const fontScale = useFontScale();

  // Limit scale between 1, and 1.5
  const scale = Math.min(1.5, Math.max(fontScale, 1));
  return {
    android: {
      transform: [{scale}],
    },
    androidDisabled: {
      opacity: 0.5,
    },
    ios: {
      transform: [{scale: 0.7 * scale}],
    },
    fixedDimensions: {
      // Fix for React Native 0.81 Switch component layout problem
      // Adding explicit dimensions as recommended in the issue
      width: 51, // Standard iOS switch width
      height: 31, // Standard iOS switch height
    },
  };
});
