import React, {createContext, useContext, useEffect, useState} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import {
  RemoteConfig,
  defaultRemoteConfig,
  getConfig,
  defaultModesWeSellTicketsFor,
} from './remote-config';
import Bugsnag from '@bugsnag/react-native';
import {TariffZone, UserProfile} from './reference-data/types';
import {
  defaultPreassignedFareProducts,
  defaultTariffZones,
  defaultUserProfiles,
} from './reference-data/defaults';
import {useAppState} from './AppContext';

export type RemoteConfigContextState = RemoteConfig & {
  refresh: () => void;
  modes_we_sell_tickets_for: string[];
  tariff_zones: TariffZone[];
  user_profiles: UserProfile[];
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

type RemoteConfigError = {
  userInfo: UserInfoErrorFromFirebase;
} & Error;

function isRemoteConfigError(error: any): error is RemoteConfigError {
  return 'userInfo' in error;
}

function isUserInfo(a: any): a is UserInfoErrorFromFirebase {
  return a && 'code' in a && 'message' in a;
}

const RemoteConfigContextProvider: React.FC = ({children}) => {
  const [config, setConfig] = useState<RemoteConfig>(defaultRemoteConfig);
  const {isLoading: isLoadingAppState, newBuildSincePreviousLaunch} =
    useAppState();

  async function fetchConfig() {
    try {
      await remoteConfig().fetchAndActivate();
      const currentConfig = await getConfig();
      setConfig(currentConfig);
    } catch (e) {
      if (isRemoteConfigError(e) && isUserInfo(e.userInfo)) {
        const {userInfo} = e;

        if (userInfo.code === 'failure' || userInfo.fatal) {
          Bugsnag.notify(e, function (event) {
            event.addMetadata('metadata', {userInfo});
            event.severity = 'info';
          });
        }
      } else {
        Bugsnag.notify(e as any);
      }
    }
  }

  useEffect(() => {
    async function setupRemoteConfig() {
      const configApi = remoteConfig();
      await configApi.setConfigSettings({
        minimumFetchIntervalMillis: 21600000, // 6 hours
      });
      await configApi.setDefaults(defaultRemoteConfig);
      if (newBuildSincePreviousLaunch) {
        await refresh();
      } else {
        await fetchConfig();
      }
    }

    if (!isLoadingAppState) {
      setupRemoteConfig();
    }
  }, [isLoadingAppState, newBuildSincePreviousLaunch]);

  async function refresh() {
    const configApi = remoteConfig();
    const {minimumFetchIntervalMillis} = configApi.settings;
    await configApi.setConfigSettings({
      minimumFetchIntervalMillis: 0,
    });
    await fetchConfig();
    await configApi.setConfigSettings({
      minimumFetchIntervalMillis,
    });
    console.warn('Force-refreshed Remote Config');
  }

  return (
    <RemoteConfigContext.Provider
      value={{
        ...config,
        modes_we_sell_tickets_for: parseJson(
          config.modes_we_sell_tickets_for,
          defaultModesWeSellTicketsFor,
        ),
        tariff_zones: parseJson(config.tariff_zones, defaultTariffZones),
        user_profiles: parseJson(config.user_profiles, defaultUserProfiles),
        refresh,
      }}
    >
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

const parseJson = (text: string, defaultObject: object) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn('Error parsing this json:', text, err);
    return defaultObject;
  }
};

export default RemoteConfigContextProvider;
