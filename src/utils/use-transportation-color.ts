import {useTheme} from '@atb/theme';
import {AnyMode, AnySubMode} from '@atb/components/transportation-icon';

export function useTransportationColor(
  mode?: AnyMode,
  subMode?: AnySubMode,
  colorType: 'color' | 'backgroundColor' = 'backgroundColor',
): string {
  const {theme} = useTheme();
  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'localBus') {
        return theme.colors.transport_city[colorType];
      }
      return theme.colors.transport_region[colorType];
    case 'rail':
      return theme.colors.transport_train[colorType];
    case 'tram':
      return theme.colors.transport_city[colorType];
    case 'water':
      return theme.colors.transport_boat[colorType];
    case 'air':
      return theme.colors.transport_plane[colorType];
    default:
      return theme.colors.transport_other[colorType];
  }
}
