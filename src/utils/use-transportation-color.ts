import {useTheme} from '@atb/theme';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {ContrastColor, TransportColor} from '@atb/theme/colors';

export function useTransportationColor(
  mode?: AnyMode,
  subMode?: AnySubMode,
  isFlexible?: boolean,
  colorMode: keyof TransportColor[keyof TransportColor] = 'primary',
): ContrastColor {
  const themeColor = useThemeColorForTransportMode(mode, subMode, isFlexible);
  const {theme} = useTheme();
  return theme.color.transport[themeColor][colorMode];
}

export const useThemeColorForTransportMode = (
  mode?: AnyMode,
  subMode?: AnySubMode,
  isFlexible?: boolean,
): keyof TransportColor => {
  if (isFlexible) return 'flexible';
  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'localBus') return 'city';
      if (subMode === 'airportLinkBus') return 'airportExpress';
      return 'region';
    case 'bicycle':
      return 'bike';
    case 'car':
      return 'car';
    case 'scooter':
      return 'scooter';
    case 'rail':
      if (subMode === 'airportLinkRail') return 'airportExpress';
      return 'train';
    case 'tram':
      return 'city';
    case 'water':
      return 'boat';
    case 'air':
      return 'other';
    case 'metro':
      return 'train';
    default:
      return 'other';
  }
};
