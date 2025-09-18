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
      | 'positionArrowContainer'
      | 'mapButtonsContainer'
      | 'mapButtonsContainerLeft'
      | 'mapButtonsContainerRight'
      | 'locationContainer']: ViewStyle;
  }>(
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

      mapButtonsContainer: {
        position: 'absolute',
        bottom: (extraPaddingBottom ? bottom : 0) + theme.spacing.medium,
      },

      mapButtonsContainerLeft: {
        left: theme.spacing.medium,
      },

      mapButtonsContainerRight: {
        right: theme.spacing.medium,
      },
      locationContainer: {
        position: 'absolute',
        top: top + theme.spacing.medium + 28 + theme.spacing.medium,
        paddingHorizontal: theme.spacing.medium,
        width: '100%',
      },
    }),
    [top, theme.spacing.medium, extraPaddingBottom, bottom],
  );
}
