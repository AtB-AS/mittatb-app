import React, {createContext, useContext} from 'react';
import {storage} from '@atb/modules/storage';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
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

type Props = {
  children: React.ReactNode;
};

export const FeatureTogglesContextProvider = ({children}: Props) => {
  const remoteConfig = useRemoteConfigContext();

  const state = useFeatureTogglesContextState(remoteConfig, storage);

  return (
    <FeatureTogglesContext.Provider value={state}>
      {children}
    </FeatureTogglesContext.Provider>
  );
};

export function useFeatureTogglesContext() {
  const context = useContext(FeatureTogglesContext);
  if (context === undefined) {
    throw new Error(
      'useFeatureToggles must be used within a FeatureTogglesContextProvider',
    );
  }
  return context;
}
