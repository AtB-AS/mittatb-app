import useDelayGate from '@atb/utils/use-delay-gate';
import React, {useEffect, useState} from 'react';
import {AccessibilityProps, Switch, SwitchProps, Platform} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import useFontScale from '@atb/utils/use-font-scale';
import {InteractiveColor} from '@atb/theme/colors';

type Props = Pick<SwitchProps, 'value' | 'onValueChange' | 'testID'> & {
  interactiveColor?: InteractiveColor;
} & AccessibilityProps;

// A bug in RN borks Switch animations when Switch is used inside react navigation
// for Android. A small delay to render and setting value through state
// seems to mitigate the bug
export function Toggle({
  value,
  onValueChange,
  interactiveColor = 'interactive_1',
  ...props
}: Props) {
  const [checked, setChecked] = useState(value);
  const {theme} = useTheme();
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
        true: theme.interactive[interactiveColor].outline.background,
        false: theme.static.background.background_3.background,
      }}
      thumbColor="white"
      style={Platform.OS === 'android' ? styles.android : styles.ios}
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
    ios: {
      transform: [{scale: 0.7 * scale}],
    },
  };
});
