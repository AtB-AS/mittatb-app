import type {RemoteConfig} from '@atb/remote-config';
import type {StorageService} from '@atb/modules/storage';
import type {FeatureTogglesContextState, OverridesMap} from './types';
import {useEffect, useState} from 'react';
import {
  getDebugOverridesFromSpecs,
  getFeatureTogglesFromSpecs,
  getStoredOverrides,
  toStorageKey,
} from './utils';

/**
 * This is an extracted hook for the provider body, to improve testability and
 * dependency injection.
 */
export const useFeatureTogglesContextState = (
  remoteConfig: RemoteConfig,
  storageService: StorageService,
): FeatureTogglesContextState => {
  const [overridesMap, setOverridesMap] = useState<OverridesMap>({});
  useEffect(() => {
    getStoredOverrides(storageService).then(setOverridesMap);
  }, [storageService]);

  const featureToggles = getFeatureTogglesFromSpecs(remoteConfig, overridesMap);

  return {
    ...featureToggles,
    debug: {
      overrides: getDebugOverridesFromSpecs(overridesMap),
      setOverride: (name, val) => {
        const key = toStorageKey(name);
        storageService.set(key, JSON.stringify(val === undefined ? null : val));
        setOverridesMap({...overridesMap, ...{[key]: val}});
      },
    },
  };
};
