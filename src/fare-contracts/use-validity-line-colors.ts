import {useFirestoreConfiguration} from '@atb/configuration';
import {useTheme} from '@atb/theme';
import {useTransportationColor} from '@atb/utils/use-transportation-color';

export function useValidityLineColors(fareProductType?: string) {
  const {theme} = useTheme();
  const {fareProductTypeConfigs} = useFirestoreConfiguration();

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === fareProductType,
  );

  const {mode, subMode} = fareProductTypeConfig?.transportModes?.[0] || {};

  const lineColor = theme.static.background.background_2.background;
  const backgroundColor = useTransportationColor(mode, subMode);

  return {
    lineColor,
    backgroundColor: mode
      ? backgroundColor
      : theme.static.status.valid.background,
  };
}
