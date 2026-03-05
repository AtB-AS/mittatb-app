import {useThemeContext} from '@atb/theme';
import {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

export function useScrollBorder() {
  const {theme} = useThemeContext();
  const scrollY = useSharedValue(0);
  const color = theme.color.background.neutral[3].background;
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const borderStyle = useAnimatedStyle(() => ({
    borderBottomWidth: 1,
    borderBottomColor: scrollY.value > 0 ? color : 'transparent',
  }));

  return {scrollHandler, borderStyle} as const;
}
