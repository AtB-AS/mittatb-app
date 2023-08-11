import {useTheme} from '@atb/theme';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {TransportColor} from '@atb/theme/colors';
import {useFirestoreConfiguration} from '@atb/configuration';

export function useTransportationColor(
  mode?: AnyMode,
  subMode?: AnySubMode,
  colorType: 'background' | 'text' = 'background',
  colorMode: 'primary' | 'secondary' = 'primary',
): string {
  const themeColor = useThemeColorForTransportMode(mode, subMode);
  const {theme} = useTheme();
  return theme.transport[themeColor][colorMode][colorType];
}

export const useThemeColorForTransportMode = (
  mode?: AnyMode,
  subMode?: AnySubMode,
): TransportColor => {
  switch (mode) {
    case 'flex':
      return 'transport_flexible';
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

export function useTransportationLineColors(fareProductType?: string) {
  const {theme} = useTheme();
  const {fareProductTypeConfigs} = useFirestoreConfiguration();

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === fareProductType,
  );

  const {mode, subMode} = fareProductTypeConfig?.transportModes?.[0] || {};

  let lineColor =
    mode === 'water'
      ? theme.static.background.background_2.background
      : theme.static.background.background_accent_0.background;
  const backgroundColor = useTransportationColor(mode, subMode);

  return {
    lineColor,
    backgroundColor: mode
      ? backgroundColor
      : theme.static.status.valid.background,
  };
}
