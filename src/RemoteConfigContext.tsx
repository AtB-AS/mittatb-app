import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import {defaultRemoteConfig, getConfig, RemoteConfig} from './remote-config';
import Bugsnag from '@bugsnag/react-native';

import {FeedbackConfiguration} from '@atb/components/feedback';
import {useInterval} from '@atb/utils/use-interval';

/**
 * The retry interval values for retrying Remote Config data fetch with
 * exponential backoff.
 */
const RETRY_INTERVAL_MS_START = 1000;
const RETRY_INTERVAL_MS_MAX = 30000;

export type RemoteConfigContextState = RemoteConfig & {
  refresh: () => void;
  isLoaded: boolean;
  feedback_questions: FeedbackConfiguration[];
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

const useRetryIntervalWithBackoff = (): [number, () => void] => {
  const [retryInterval, setRetryInterval] = useState(RETRY_INTERVAL_MS_START);
  const incrementRetryInterval = useCallback(
    () => setRetryInterval((val) => Math.min(val * 2, RETRY_INTERVAL_MS_MAX)),
    [],
  );
  return [retryInterval, incrementRetryInterval];
};

export const RemoteConfigContextProvider: React.FC = ({children}) => {
  const [config, setConfig] = useState<RemoteConfig>(defaultRemoteConfig);
  const [fetchError, setFetchError] = useState(false);
  const [retryInterval, incrementRetryInterval] = useRetryIntervalWithBackoff();
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      await remoteConfig().fetchAndActivate();
      const currentConfig = await getConfig();
      setConfig(currentConfig);
      setFetchError(false);
      setIsLoaded(true);
    } catch (e) {
      setFetchError(true);
      if (isRemoteConfigError(e) && isUserInfo(e.userInfo)) {
        const {userInfo} = e;

        if (userInfo.code === 'failure' || userInfo.fatal) {
          Bugsnag.leaveBreadcrumb('Remote config fetch error', userInfo);
        }
      } else {
        Bugsnag.notify(e as any);
      }
    }
  }, []);

  useEffect(() => {
    (async function setupRemoteConfig() {
      const configApi = remoteConfig();
      await configApi.setConfigSettings({minimumFetchIntervalMillis: 21600000}); // 6 hours
      await configApi.setDefaults(defaultRemoteConfig);
      await fetchConfig();
    })();
  }, [fetchConfig]);

  useInterval(
    () => {
      fetchConfig();
      incrementRetryInterval();
    },
    [fetchConfig, incrementRetryInterval],
    retryInterval,
    !fetchError,
  );

  const refresh = useCallback(async () => {
    const configApi = remoteConfig();
    const {minimumFetchIntervalMillis} = configApi.settings;
    await configApi.setConfigSettings({minimumFetchIntervalMillis: 0});
    await fetchConfig();
    await configApi.setConfigSettings({minimumFetchIntervalMillis});
    console.warn('Force-refreshed Remote Config');
  }, [fetchConfig]);

  return (
    <RemoteConfigContext.Provider
      value={{
        ...config,
        feedback_questions: parseJson(config.feedback_questions, []),
        refresh,
        isLoaded,
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
  if (!text) return defaultObject;
  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn('Error parsing this json:', text, err);
    return defaultObject;
  }
};
