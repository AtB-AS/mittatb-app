import colors from '../theme/colors';
import {LegMode, TransportMode, TransportSubmode} from '../sdk';
import {useTheme} from '@atb/theme';
import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export function useTransportationColor(
  mode?: LegMode | TransportMode | Types.TransportMode,
  subMode?: TransportSubmode | Types.TransportSubmode,
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
