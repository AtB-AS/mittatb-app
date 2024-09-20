import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useDebugOverride} from '@atb/debug';
import {StorageModelKeysEnum} from '@atb/storage';

export const useOnlyStopPlacesCheckboxEnabled = () => {
  const {enable_only_stop_places_checkbox} = useRemoteConfig();
  const [debugOverride] = useOnlyStopPlacesCheckboxEnabledDebugOverride();
  return debugOverride !== undefined
    ? debugOverride
    : enable_only_stop_places_checkbox;
};

export const useOnlyStopPlacesCheckboxEnabledDebugOverride = () =>
  useDebugOverride(
    StorageModelKeysEnum.EnableOnlyStopPlacesCheckboxDebugOverride,
  );
