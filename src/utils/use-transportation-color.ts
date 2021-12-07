import {LegMode, TransportMode, TransportSubmode} from '../sdk';
import {useTheme} from '@atb/theme';

export function useTransportationColor(
  mode?: LegMode | TransportMode,
  subMode?: TransportSubmode,
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
