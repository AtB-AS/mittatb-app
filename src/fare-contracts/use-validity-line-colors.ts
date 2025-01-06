import {useFirestoreConfigurationContext} from '@atb/configuration';
import {useThemeContext} from '@atb/theme';
import {useTransportationColor} from '@atb/utils/use-transportation-color';

export function useValidityLineColors(fareProductType?: string) {
  const {theme} = useThemeContext();
  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === fareProductType,
  );

  const {mode, subMode} = fareProductTypeConfig?.transportModes?.[0] || {};

  const lineColor = theme.color.background.neutral[2].background;
  const backgroundColor = useTransportationColor(mode, subMode);

  return {
    lineColor,
    backgroundColor: mode ? backgroundColor : theme.color.status.valid.primary,
  };
}
