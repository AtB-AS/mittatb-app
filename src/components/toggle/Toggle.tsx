import {useDelayGate} from '@atb/utils/use-delay-gate';
import React, {useEffect, useState} from 'react';
import {AccessibilityProps, Switch, SwitchProps, Platform} from 'react-native';
import {useThemeContext} from '@atb/theme';
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
  const fontScale = useFontScale();
  const scale = Math.min(1.5, Math.max(fontScale, 1));
  const transform = Platform.select({
    ios: [{scale: 0.7 * scale}],
    default: [{scale}],
  });

  const disabledStyle = Platform.select({
    // The disabled state is not shown visually on Android by default, so we
    // need to style it manually.
    android: {opacity: 0.5},
    default: undefined,
  });

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
      style={[{transform}, props.disabled && disabledStyle]}
      {...props}
      testID={props.testID}
    />
  ) : null;
}
