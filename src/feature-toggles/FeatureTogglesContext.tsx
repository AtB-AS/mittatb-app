import React, {createContext, useContext} from 'react';
import {storage} from '@atb/storage';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {FeatureTogglesContextState} from './types';
import {useFeatureTogglesContextState} from './use-feature-toggle-context-state';

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

  const state = useFeatureTogglesContextState(remoteConfig, storage);

  return (
    <FeatureTogglesContext.Provider value={state}>
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
