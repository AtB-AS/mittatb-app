import {useMemo} from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';

export function useControlPositionsStyle() {
  const {top, bottom} = useSafeAreaInsets();
  const {theme} = useTheme();

  return useMemo<{[key: string]: ViewStyle}>(
    () => ({
      backArrowContainer: {
        position: 'absolute',
        top: top + theme.sizes.pagePadding,
        left: theme.sizes.pagePadding,
      },
      positionArrowContainer: {
        position: 'absolute',
        top: top + theme.sizes.pagePadding,
        right: theme.sizes.pagePadding,
      },
      controlsContainer: {
        position: 'absolute',
        bottom: bottom + theme.sizes.pagePadding,
        right: theme.sizes.pagePadding,
      },
      locationContainer: {
        position: 'absolute',
        top: top + theme.sizes.pagePadding + 28 + theme.sizes.pagePadding,
        paddingHorizontal: theme.sizes.pagePadding,
        width: '100%',
      },
    }),
    [bottom, top],
  );
}
