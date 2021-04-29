import React, {createContext, useContext, useEffect, useState} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import {RemoteConfig, defaultRemoteConfig, getConfig} from './remote-config';
import Bugsnag from '@bugsnag/react-native';
import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from './reference-data/types';
import {
  defaultPreassignedFareProducts,
  defaultTariffZones,
  defaultUserProfiles,
} from './reference-data/defaults';

export type RemoteConfigContextState = Pick<
  RemoteConfig,
  | 'enable_ticketing'
  | 'enable_intercom'
  | 'enable_i18n'
  | 'enable_creditcard'
  | 'enable_recent_tickets'
  | 'enable_login'
  | 'enable_period_tickets'
  | 'must_upgrade_ticketing'
  | 'news_enabled'
  | 'news_text'
  | 'news_link_text'
  | 'news_link_url'
  | 'vat_percent'
> & {
  refresh: () => void;
  preassigned_fare_products: PreassignedFareProduct[];
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
          event.severity = 'info';
        });
      }
    }
  }

  useEffect(() => {
    async function setupRemoteConfig() {
      const configApi = remoteConfig();

      await configApi.setDefaults(defaultRemoteConfig);
      await fetchConfig();
    }

    setupRemoteConfig();
  }, []);

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
  }

  return (
    <RemoteConfigContext.Provider
      value={{
        ...config,
        preassigned_fare_products: parseJson(
          config.preassigned_fare_products,
          defaultPreassignedFareProducts,
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
