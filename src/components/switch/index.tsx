import useGate from '@atb/utils/use-gate';
import React, {useEffect, useState} from 'react';
import {Switch, SwitchProps} from 'react-native';

// A bug in RN borks Switch animations when Switch is used inside react navigation
// for Android. A small delay to render and setting value through state
// seems to mitigate the bug
export default function FixedSwitch({
  value,
  onValueChange,
  ...props
}: SwitchProps) {
  const [checked, setChecked] = useState(value);

  // Preserve outside changes
  function handleValueChange(value: boolean) {
    setChecked(value);
    onValueChange?.(value);
  }

  useEffect(() => {
    setChecked(value);
  }, [value]);

  const delayRender = useGate(10);

  return delayRender ? (
    <Switch
      {...props}
      value={checked}
      onValueChange={(value) => handleValueChange(value)}
    />
  ) : null;
}
