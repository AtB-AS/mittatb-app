import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export function useControlPositionsStyle(extraPaddingBottom = false) {
  const {top, bottom} = useSafeAreaInsets();
  const {theme} = useThemeContext();

  return useMemo<{
    [key in
      | 'backArrowContainer'
      | 'mapButtonsContainer'
      | 'mapButtonsContainerRight']: ViewStyle;
  }>(
    () => ({
      backArrowContainer: {
        position: 'absolute',
        top: top + theme.spacing.medium,
        left: theme.spacing.medium,
      },

      mapButtonsContainer: {
        position: 'absolute',
        bottom: (extraPaddingBottom ? bottom : 0) + theme.spacing.medium,
      },

      mapButtonsContainerRight: {
        right: theme.spacing.medium,
      },
    }),
    [top, theme.spacing.medium, extraPaddingBottom, bottom],
  );
}
