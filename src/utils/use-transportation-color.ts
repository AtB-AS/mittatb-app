import colors from '../theme/colors';
import {LegMode, TransportMode, TransportSubmode} from '../sdk';
import {useTheme} from '@atb/theme';

export function useTransportationColor(
  mode?: LegMode | TransportMode,
  subMode?: TransportSubmode,
): string {
  const {theme} = useTheme();
  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'localBus') {
        return theme.colors.transport_city.backgroundColor;
      }
      return theme.colors.transport_region.backgroundColor;
    case 'rail':
      return theme.colors.transport_train.backgroundColor;
    case 'tram':
      return theme.colors.transport_city.backgroundColor;
    case 'water':
      return theme.colors.transport_boat.backgroundColor;
    case 'air':
      return theme.colors.transport_plane.backgroundColor;
    default:
      return theme.colors.transport_other.backgroundColor;
  }
}
