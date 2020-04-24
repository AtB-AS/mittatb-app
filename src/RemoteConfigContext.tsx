import React, {createContext, useContext, useEffect, useState} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import {RemoteConfig, defaultRemoteConfig} from './remote-config';

export type RemoteConfigContextState = RemoteConfig & {
  refresh: () => void;
};

const RemoteConfigContext = createContext<RemoteConfigContextState | undefined>(
  undefined,
);

async function getCurrentConfig(): Promise<RemoteConfig> {
  const values = remoteConfig().getAll();
  const enable_ticketing = !!(values['enable_ticketing']?.value ?? false);
  return {enable_ticketing};
}

const RemoteConfigContextProvider: React.FC = ({children}) => {
  const [config, setConfig] = useState<RemoteConfig>(defaultRemoteConfig);

  useEffect(() => {
    async function setupRemoteConfig() {
      const configApi = remoteConfig();

      if (__DEV__) {
        configApi.setConfigSettings({
          isDeveloperModeEnabled: true,
        });
      }

      await configApi.setDefaults(defaultRemoteConfig);

      await configApi.fetchAndActivate();
      const currentConfig = await getCurrentConfig();
      setConfig(currentConfig);
    }

    setupRemoteConfig();
  }, []);

  async function refresh() {
    await remoteConfig().fetchAndActivate();
    const currentConfig = await getCurrentConfig();
    setConfig(currentConfig);
  }

  return (
    <RemoteConfigContext.Provider value={{...config, refresh}}>
      {children}
    </RemoteConfigContext.Provider>
  );
};

export function useRemoteConfig() {
  const context = useContext(RemoteConfigContext);
  if (context === undefined) {
    throw new Error(
      'useRemoteConfig must be used within a RemoteConfigContextProvider',
    );
  }
  return context;
}

export default RemoteConfigContextProvider;
