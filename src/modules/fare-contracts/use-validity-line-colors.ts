import {useFirestoreConfigurationContext} from '@atb/configuration';
import {useThemeContext} from '@atb/theme';
import {useTransportColor} from '@atb/utils/use-transport-color';

export function useValidityLineColors(fareProductType?: string) {
  const {theme} = useThemeContext();
  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === fareProductType,
  );

  const {mode, subMode} = fareProductTypeConfig?.transportModes?.[0] || {};

  const backgroundColor = useTransportColor(mode, subMode);

  return {
    backgroundColor: mode
      ? backgroundColor.primary
      : theme.color.status.valid.primary,
  };
}
