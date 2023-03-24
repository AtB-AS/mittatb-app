import {useTheme} from '@atb/theme';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {StaticColorByType} from '@atb/theme/colors';

export function useTransportationColor(
  mode?: AnyMode,
  subMode?: AnySubMode,
  colorType: 'background' | 'text' = 'background',
): string {
  const themeColor = useThemeColorForTransportMode(mode, subMode);
  const {theme} = useTheme();
  return theme.static.transport[themeColor][colorType];
}

export const useThemeColorForTransportMode = (
  mode?: AnyMode,
  subMode?: AnySubMode,
): StaticColorByType<'transport'> => {
  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'localBus') return 'transport_city';
      if (subMode === 'airportLinkBus') return 'transport_airport_express';
      return 'transport_region';
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
