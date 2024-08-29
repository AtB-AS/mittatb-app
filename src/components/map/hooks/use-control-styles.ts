import {useTheme} from '@atb/theme';
import {useMemo} from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {useBottomNavigationStyles} from '@atb/utils/navigation';

export function useControlPositionsStyle() {
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
          bottom + bottomPaddingIfBottomSheetIsOpen + theme.spacing.medium,
        right: theme.spacing.medium,
      },
      locationContainer: {
        position: 'absolute',
        top: top + theme.spacing.medium + 28 + theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
        width: '100%',
      },
    }),
    [theme, bottom, top, bottomPaddingIfBottomSheetIsOpen],
  );
}
