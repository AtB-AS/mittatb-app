import React, {createContext, useContext, useEffect, useState} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import bugsnag from './diagnostics/bugsnag';

export type RemoteConfigState = {
  enable_ticketing: boolean;
};

export type RemoteConfigContextState = RemoteConfigState & {
  refresh: () => void;
};

const RemoteConfigContext = createContext<RemoteConfigContextState | undefined>(
  undefined,
);

const defaultRemoteConfigState: RemoteConfigState = {
  enable_ticketing: false,
};

async function getCurrentConfig(): Promise<RemoteConfigState> {
  const values = remoteConfig().getAll();
  const enable_ticketing = !!(values['enable_ticketing']?.value ?? false);
  return {enable_ticketing};
}

const RemoteConfigContextProvider: React.FC = ({children}) => {
  const [state, setState] = useState<RemoteConfigState>(
    defaultRemoteConfigState,
  );

  useEffect(() => {
    async function setupRemoteConfig() {
      const config = remoteConfig();

      if (__DEV__) {
        config.setConfigSettings({
          isDeveloperModeEnabled: true,
        });
      }

      await config.setDefaults(defaultRemoteConfigState);

      await config.fetchAndActivate();
      const currentConfig = await getCurrentConfig();
      setState(currentConfig);
    }

    setupRemoteConfig();
  }, []);

  async function refresh() {
    await remoteConfig().fetchAndActivate();
    const currentConfig = await getCurrentConfig();
    setState(currentConfig);
  }

  return (
    <RemoteConfigContext.Provider value={{...state, refresh}}>
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
