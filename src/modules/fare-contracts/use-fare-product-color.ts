import {ContrastColor, useThemeContext} from '@atb/theme';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {TransportMode} from '@atb/modules/fare-contracts';

export function useFareProductColor(
  transportModes?: TransportMode[],
): ContrastColor {
  const {theme} = useThemeContext();

  const {mode, subMode} = transportModes?.[0] ?? {};
  const transportColor = useTransportColor(mode, subMode);

  if (!mode) {
    return theme.color.status.valid.primary;
  }
  return transportColor.primary;
}
