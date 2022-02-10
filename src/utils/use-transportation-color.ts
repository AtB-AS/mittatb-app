import {useTheme} from '@atb/theme';
import {AnyMode, AnySubMode} from '@atb/components/transportation-icon';
import {ThemeColor} from '@atb/theme/colors';

export function useTransportationColor(
  mode?: AnyMode,
  subMode?: AnySubMode,
  colorType: 'color' | 'backgroundColor' = 'backgroundColor',
): string {
  const themeColor = useThemeColorForTransportMode(mode, subMode);
  const {theme} = useTheme();
  return theme.colors[themeColor][colorType];
}

export const useThemeColorForTransportMode = (
  mode?: AnyMode,
  subMode?: AnySubMode,
): ThemeColor => {
  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'localBus') {
        return 'transport_city';
      }
      return 'transport_region';
    case 'rail':
      return 'transport_train';
    case 'tram':
      return 'transport_city';
    case 'water':
      return 'transport_boat';
    case 'air':
      return 'transport_plane';
    case 'metro':
      return 'transport_train';
    default:
      return 'transport_other';
  }
};
