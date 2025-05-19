import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {ContrastColor, useThemeContext} from '@atb/theme';
import {useTransportColor} from '@atb/utils/use-transport-color';

export function useFareProductColor(fareProductType?: string): ContrastColor {
  const {theme} = useThemeContext();

  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === fareProductType,
  );

  const {mode, subMode} = fareProductTypeConfig?.transportModes?.[0] || {};
  const transportColor = useTransportColor(mode, subMode);

  if (!mode) {
    return theme.color.status.valid.primary;
  }
  return transportColor.primary;
}
