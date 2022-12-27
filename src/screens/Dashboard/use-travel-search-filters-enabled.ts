import {useRemoteConfig} from '@atb/RemoteConfigContext';
import storage, {StorageModelKeysEnum} from '@atb/storage';
import {useEffect, useState} from 'react';
import {parseBoolean} from '@atb/utils/parse-boolean';

export const useTravelSearchFiltersEnabled = () => {
  const [debugOverride] = useTravelSearchFiltersDebugOverride();
  const {enable_travel_search_filters: enabledInRemoteConfig} =
    useRemoteConfig();

  if (debugOverride !== undefined) {
    return debugOverride;
  }
  return enabledInRemoteConfig;
};

export const useTravelSearchFiltersDebugOverride = (): [
  boolean | undefined,
  (v?: boolean) => void,
] => {
  const [debugOverride, setDebugOverride] = useState<boolean>();

  useEffect(() => {
    storage
      .get(StorageModelKeysEnum.EnableTravelSearchFiltersDebugOverride)
      .then(parseBoolean)
      .then(setDebugOverride);
  }, []);

  const updateDebugOverride = (val?: boolean) => {
    storage.set(
      StorageModelKeysEnum.EnableTravelSearchFiltersDebugOverride,
      JSON.stringify(val === undefined ? null : val),
    );
    setDebugOverride(val);
  };

  return [debugOverride, updateDebugOverride];
};
