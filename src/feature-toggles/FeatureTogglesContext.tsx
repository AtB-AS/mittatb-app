import React, {createContext, useContext, useEffect, useState} from 'react';
import {storage} from '@atb/storage';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {
  DebugOverride,
  FeatureToggles,
  OverridesMap,
  SetDebugOverride,
} from './types';
import {
  getDebugOverridesFromSpecs,
  getFeatureTogglesFromSpecs,
  getStoredOverrides,
} from './utils.ts';

type FeatureTogglesContextState = FeatureToggles & {
  debug: {
    overrides: DebugOverride[];
    setOverride: SetDebugOverride;
  };
};

/**
 * A contexts for retrieving feature toggle values.
 *
 * Note: New feature toggles are added in the toggle-specifications file.
 */
const FeatureTogglesContext = createContext<
  FeatureTogglesContextState | undefined
>(undefined);

export const FeatureTogglesProvider: React.FC = ({children}) => {
  const remoteConfig = useRemoteConfig();
  const [overridesMap, setOverridesMap] = useState<OverridesMap>({});

  useEffect(() => {
    getStoredOverrides().then(setOverridesMap);
  }, []);

  const featureToggles = getFeatureTogglesFromSpecs(remoteConfig, overridesMap);

  const value: FeatureTogglesContextState = {
    ...featureToggles,
    debug: {
      overrides: getDebugOverridesFromSpecs(overridesMap),
      setOverride: (key, val) => {
        storage.set(key, JSON.stringify(val === undefined ? null : val));
        setOverridesMap({...overridesMap, ...{[key]: val}});
      },
    },
  };

  return (
    <FeatureTogglesContext.Provider value={value}>
      {children}
    </FeatureTogglesContext.Provider>
  );
};

export function useFeatureToggles() {
  const context = useContext(FeatureTogglesContext);
  if (context === undefined) {
    throw new Error(
      'useFeatureToggles must be used within a FeatureTogglesContextProvider',
    );
  }
  return context;
}
