import React, {createContext, useContext, useEffect, useState} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import {RemoteConfig, defaultRemoteConfig, getConfig} from './remote-config';
import Bugsnag from '@bugsnag/react-native';

export type RemoteConfigContextState = RemoteConfig & {
  refresh: () => void;
};

const RemoteConfigContext = createContext<RemoteConfigContextState | undefined>(
  undefined,
);

type UserInfoErrorFromFirebase = {
  code: 'no_fetch_yet' | 'success' | 'throttled' | 'failure' | 'unknown';
  message: string;
  fatal: boolean;
  nativeErrorMessage: string;
  nativeErrorCode: number;
};

function isUserInfo(a: any): a is UserInfoErrorFromFirebase {
  return a && 'code' in a && 'message' in a;
}

const RemoteConfigContextProvider: React.FC = ({children}) => {
  const [config, setConfig] = useState<RemoteConfig>(defaultRemoteConfig);

  async function fetchConfig() {
    try {
      await remoteConfig().fetchAndActivate();
      const currentConfig = await getConfig();
      setConfig(currentConfig);
    } catch (e) {
      const userInfo = e.userInfo;
      if (!isUserInfo(userInfo)) {
        throw e;
      }
      if (
        isUserInfo(userInfo) &&
        (userInfo.code === 'failure' || userInfo.fatal)
      ) {
        Bugsnag.notify(e, function (event) {
          event.addMetadata('metadata', {userInfo});
        });
      }
    }
  }

  useEffect(() => {
    async function setupRemoteConfig() {
      const configApi = remoteConfig();

      if (__DEV__) {
        configApi.setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });
      }
      await configApi.setDefaults(defaultRemoteConfig);
      await fetchConfig();
    }

    setupRemoteConfig();
  }, []);

  async function refresh() {
    await remoteConfig().reset();
    await fetchConfig();
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
