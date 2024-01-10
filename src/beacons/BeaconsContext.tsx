import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useIsBeaconsEnabled} from './use-is-beacons-enabled';
import {KETTLE_API_KEY} from '@env';
import {Kettle} from 'react-native-kettle-module';
import {NativeModules, Platform} from 'react-native';
import {
  BEACONS_CONSENTS,
  allowedPermissionForKettle,
  requestAndroidBeaconPermissions,
} from './permissions';
import {useBeaconsMessages} from './use-beacons-messages';
import {storage} from '@atb/storage';
import {parseBoolean} from '@atb/utils/parse-boolean';

type KettleInfo = {
  isKettleStarted: boolean;
  kettleIdentifier: string | null;
  kettleConsents: Record<string, boolean> | null;
  isBeaconsOnboarded: boolean;
};

type BeaconsContextState = {
  isBeaconsSupported: boolean;
  kettleInfo?: KettleInfo;
  onboardForBeacons: () => Promise<boolean>;
  revokeBeacons: () => Promise<void>;
  deleteCollectedData: () => Promise<void>;
  getPrivacyDashboardUrl: () => Promise<string>;
  getPrivacyTermsUrl: () => Promise<string>;
};

const defaultState = {
  isBeaconsSupported: false,
  kettleInfo: undefined,
  getPrivacyDashboardUrl: () => {
    return new Promise<string>(() => {});
  },
  getPrivacyTermsUrl: () => {
    return new Promise<string>(() => {});
  },
  onboardForBeacons: () => {
    return new Promise<boolean>(() => {
      return false;
    });
  },
  revokeBeacons: () => {
    return new Promise<void>(() => {});
  },
  deleteCollectedData: () => {
    return new Promise<void>(() => {});
  },
};

enum storeKey {
  beaconsConsent = '@ATB_beacons_consent_granted',
}

const BeaconsContext = createContext<BeaconsContextState>(defaultState);

const BeaconsContextProvider: React.FC = ({children}) => {
  const [isBeaconsEnabled, debugOverrideReady] = useIsBeaconsEnabled();
  const isBeaconsSupported =
    isBeaconsEnabled && debugOverrideReady && !!KETTLE_API_KEY;
  const {rationaleMessages} = useBeaconsMessages();
  const isInitializedRef = useRef(false);
  const [kettleInfo, setKettleInfo] = useState<KettleInfo>();

  const updateKettleInfo = () => getKettleInfo().then(setKettleInfo);

  const initializeKettleSDK = useCallback(async () => {
    if (!isInitializedRef.current) {
      const permissions = await allowedPermissionForKettle();
      if (permissions.length > 0) {
        await NativeModules.KettleSDKExtension.initializeKettleSDK();
        isInitializedRef.current = true;
      }
    }
  }, []);

  const getPrivacyDashboardUrl = useCallback(async () => {
    if (!isInitializedRef.current) return;
    const url = await Kettle.getPrivacyDashboardUrl();
    return url;
  }, []);

  const getPrivacyTermsUrl = useCallback(async () => {
    if (!isInitializedRef.current) return;
    const url = await Kettle.getPrivacyTermsUrl();
    return url;
  }, []);

  const onboardForBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return false;

    let granted = false;
    if (Platform.OS === 'ios') {
      // NOTE: This module can be found in /ios/Shared/BeaconsPermissions.swift
      granted = await NativeModules.BeaconsPermissions.request();
    } else {
      granted = await requestAndroidBeaconPermissions(rationaleMessages);
    }

    if (granted) {
      // Initialize beacons SDK after consent is granted
      await initializeKettleSDK();
      Kettle.grant(BEACONS_CONSENTS);
      await storage.set(storeKey.beaconsConsent, 'true');
      await updateKettleInfo();
    }

    return granted;
  }, [isBeaconsSupported, rationaleMessages, initializeKettleSDK]);

  const revokeBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (isInitializedRef.current) {
      const permissions = await allowedPermissionForKettle();
      Kettle.stop(permissions);
      Kettle.revoke(BEACONS_CONSENTS);
      await storage.set(storeKey.beaconsConsent, 'false');
      await updateKettleInfo();
    }
  }, [isBeaconsSupported]);

  const deleteCollectedData = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (isInitializedRef.current) {
      try {
        await Kettle.deleteCollectedData();
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }, [isBeaconsSupported]);

  useEffect(() => {
    (async function () {
      if (!isBeaconsSupported) return;
      const consentGranted =
        parseBoolean(await storage.get(storeKey.beaconsConsent)) ?? false;

      // Initialize beacons if consent is granted and not initialized
      if (consentGranted && !isInitializedRef.current) {
        await initializeKettleSDK();
      }

      const permissions = await allowedPermissionForKettle();
      if (consentGranted && permissions && !kettleInfo?.isKettleStarted) {
        Kettle.start(permissions);
        await updateKettleInfo();
      }
    })();
  }, [isBeaconsSupported, initializeKettleSDK, kettleInfo]);

  return (
    <BeaconsContext.Provider
      value={{
        isBeaconsSupported,
        kettleInfo,
        onboardForBeacons,
        revokeBeacons,
        deleteCollectedData,
        getPrivacyDashboardUrl,
        getPrivacyTermsUrl,
      }}
    >
      {children}
    </BeaconsContext.Provider>
  );
};

const getKettleInfo = async (): Promise<KettleInfo> => {
  const status = await Kettle.isStarted();
  const identifier = await Kettle.getIdentifier();
  const consents = await Kettle.getGrantedConsents();
  const consentGranted =
    parseBoolean(await storage.get(storeKey.beaconsConsent)) ?? false;

  return {
    isKettleStarted: status,
    kettleIdentifier: identifier,
    kettleConsents: consents,
    isBeaconsOnboarded: consentGranted,
  };
};

export function useBeaconsState() {
  const context = useContext(BeaconsContext);
  if (context === undefined) {
    throw new Error(
      'useBeaconsState must be used within an useBeaconsStateProvider',
    );
  }
  return context;
}

export {BeaconsContextProvider};
