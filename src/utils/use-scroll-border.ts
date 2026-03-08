import {useCallback, useState} from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';
import {useThemeContext} from '@atb/theme';

export function useScrollBorder() {
  const {theme} = useThemeContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const color = theme.color.background.neutral[3].background;

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      setIsScrolled(y > 0);
    },
    [],
  );

  const borderStyle: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: isScrolled ? color : 'transparent',
  };

  return {onScroll, borderStyle} as const;
}
