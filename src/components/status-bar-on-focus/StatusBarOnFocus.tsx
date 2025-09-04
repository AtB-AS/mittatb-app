import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {StatusBar, StatusBarProps} from 'react-native';

export function StatusBarOnFocus(
  props: StatusBarProps,
): React.JSX.Element | null {
  const isFocused = useIsFocused();
  if (!isFocused) return null;

  return <StatusBar {...props} />;
}
