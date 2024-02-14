import {useTheme} from '@atb/theme';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {TransportColor} from '@atb/theme/colors';

export function useTransportationColor(
  mode?: AnyMode,
  subMode?: AnySubMode,
  isFlexible?: boolean,
  colorType: 'background' | 'text' = 'background',
  colorMode: 'primary' | 'secondary' = 'primary',
): string {
  const themeColor = useThemeColorForTransportMode(mode, subMode, isFlexible);
  const {theme} = useTheme();
  return theme.transport[themeColor][colorMode][colorType];
}

export const useThemeColorForTransportMode = (
  mode?: AnyMode,
  subMode?: AnySubMode,
  isFlexible?: boolean,
): TransportColor => {
  if (isFlexible) return 'transport_flexible';
  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'localBus') return 'transport_city';
      if (subMode === 'airportLinkBus') return 'transport_airport_express';
      return 'transport_region';
    case 'bicycle':
      return 'transport_bike';
    case 'car':
      return 'transport_car';
    case 'scooter':
      return 'transport_scooter';
    case 'rail':
      if (subMode === 'airportLinkRail') return 'transport_airport_express';
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
