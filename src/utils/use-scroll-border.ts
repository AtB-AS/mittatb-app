import {useCallback, useState} from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';
import {useThemeContext} from '@atb/theme';

/**
 * Hook to show a bottom border on a header when the user has scrolled.
 * Returns an `onScroll` handler to attach to a ScrollView/FlatList, and a
 * `borderStyle` to apply to the header element. The border is transparent
 * when scroll position is at 0 (the top) and becomes visible as soon as 
 * the content is scrolled.
 */
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
