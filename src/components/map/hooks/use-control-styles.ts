import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {useBottomNavigationStyles} from '@atb/utils/navigation';

export function useControlPositionsStyle(extraPaddingBottom = false) {
  const {top, bottom} = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const {height: bottomSheetHeight} = useBottomSheetContext();
  const {minHeight} = useBottomNavigationStyles();

  const bottomPaddingIfBottomSheetIsOpen = bottomSheetHeight
    ? bottomSheetHeight - minHeight
    : 0;

  return useMemo<{[key: string]: ViewStyle}>(
    () => ({
      backArrowContainer: {
        position: 'absolute',
        top: top + theme.spacing.medium,
        left: theme.spacing.medium,
      },
      positionArrowContainer: {
        position: 'absolute',
        top: top + theme.spacing.medium,
        right: theme.spacing.medium,
      },
      controlsContainer: {
        position: 'absolute',
        bottom:
          (extraPaddingBottom ? bottom : 0) +
          bottomPaddingIfBottomSheetIsOpen +
          theme.spacing.medium,
        right: theme.spacing.medium,
      },
      locationContainer: {
        position: 'absolute',
        top: top + theme.spacing.medium + 28 + theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
        width: '100%',
      },
    }),
    [
      top,
      theme.spacing.medium,
      extraPaddingBottom,
      bottom,
      bottomPaddingIfBottomSheetIsOpen,
    ],
  );
}
