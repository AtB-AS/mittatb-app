import {useTheme} from '@atb/theme';
import {useMemo} from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {useBottomNavigationStyles} from '@atb/utils/navigation';

export function useControlPositionsStyle(extraPaddingBottom = false) {
  const {top, bottom} = useSafeAreaInsets();
  const {theme} = useTheme();
  const {height: bottomSheetHeight} = useBottomSheet();
  const {minHeight} = useBottomNavigationStyles();

  const bottomPaddingIfBottomSheetIsOpen = bottomSheetHeight
    ? bottomSheetHeight - minHeight
    : 0;

  return useMemo<{[key: string]: ViewStyle}>(
    () => ({
      backArrowContainer: {
        position: 'absolute',
        top: top + theme.spacings.medium,
        left: theme.spacings.medium,
      },
      positionArrowContainer: {
        position: 'absolute',
        top: top + theme.spacings.medium,
        right: theme.spacings.medium,
      },
      controlsContainer: {
        position: 'absolute',
        bottom:
          (extraPaddingBottom ? bottom : 0) +
          bottomPaddingIfBottomSheetIsOpen +
          theme.spacings.medium,
        right: theme.spacings.medium,
      },
      locationContainer: {
        position: 'absolute',
        top: top + theme.spacings.medium + 28 + theme.spacings.medium,
        paddingHorizontal: theme.spacings.medium,
        width: '100%',
      },
    }),
    [
      top,
      theme.spacings.medium,
      extraPaddingBottom,
      bottom,
      bottomPaddingIfBottomSheetIsOpen,
    ],
  );
}
