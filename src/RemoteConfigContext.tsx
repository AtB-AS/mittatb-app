import React, {createContext, useContext, useEffect, useState} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import {RemoteConfig, defaultRemoteConfig, getConfig} from './remote-config';

export type RemoteConfigContextState = RemoteConfig & {
  refresh: () => void;
};

const RemoteConfigContext = createContext<RemoteConfigContextState | undefined>(
  undefined,
);

const RemoteConfigContextProvider: React.FC = ({children}) => {
  const [config, setConfig] = useState<RemoteConfig>(defaultRemoteConfig);

  useEffect(() => {
    async function setupRemoteConfig() {
      const configApi = remoteConfig();

      if (__DEV__) {
        configApi.setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });
      }

      await configApi.setDefaults(defaultRemoteConfig);

      await configApi.fetchAndActivate();
      const currentConfig = await getConfig();
      setConfig(currentConfig);
    }

    setupRemoteConfig();
  }, []);

  async function refresh() {
    await remoteConfig().reset();
    await remoteConfig().fetchAndActivate();
    const currentConfig = await getConfig();
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
