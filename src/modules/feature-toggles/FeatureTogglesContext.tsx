import React, {createContext, useContext} from 'react';
import {storage} from '@atb/modules/storage';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {FeatureTogglesContextState} from './types';
import {useFeatureTogglesContextState} from './use-feature-toggle-context-state';
import {useIntercomMetadata} from '@atb/modules/chat';

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
  const {updateMetadata} = useIntercomMetadata();

  if (state.isEventStreamEnabled && state.isEventStreamFareContractsEnabled) {
    try {
      updateMetadata({'AtB-Stream-Enabled': 'true'});
    } catch (error) {
      console.error(
        'Failed to update Intercom metadata with stream enabled',
        error,
      );
    }
  }

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
