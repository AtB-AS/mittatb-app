import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useIsBeaconsEnabled} from './use-is-beacons-enabled';
import {KETTLE_API_KEY} from '@env';
import {Kettle} from 'react-native-kettle-module';
import {NativeModules, Platform} from 'react-native';
import {
  BEACONS_CONSENTS,
  allowedPermissionForKettle,
  requestAndroidPermissions,
} from './permissions';
import {useBeaconsMessages} from './use-beacons-messages';
import {storage} from '@atb/storage';

type KettleInfo = {
  isKettleStarted: boolean;
  kettleIdentifier: string | null;
  kettleConsents: Record<string, boolean> | null;
  isBeaconsOnboarded: boolean;
  privacyDashboardUrl?: string;
  privacyTermsUrl?: string;
};

type BeaconsContextState = {
  isKettleSDKInitialized: boolean;
  isBeaconsSupported: boolean;
  kettleInfo?: KettleInfo;
  onboardForBeacons: () => void;
  revokeBeacons: () => void;
  deleteCollectedData: () => void;
};

const defaultState = {
  isKettleSDKInitialized: false,
  isBeaconsSupported: false,
  kettleInfo: undefined,
  onboardForBeacons: () => {},
  revokeBeacons: () => {},
  deleteCollectedData: () => {},
};

enum storeKey {
  beaconsConsent = '@ATB_beacons_consent_granted',
}

const BeaconsContext = createContext<BeaconsContextState>(defaultState);

const BeaconsContextProvider: React.FC = ({children}) => {
  const [isBeaconsEnabled, debugOverrideReady] = useIsBeaconsEnabled();
  const isBeaconsSupported =
    isBeaconsEnabled && debugOverrideReady && !!KETTLE_API_KEY;
  const {getRationaleMessages} = useBeaconsMessages();
  const [isKettleSDKInitialized, setKettleSDKInitialized] = useState(false);
  const [kettleInfo, setKettleInfo] = useState<KettleInfo>();

  const updateKettleInfo = useCallback(async () => {
    if (isBeaconsSupported && isKettleSDKInitialized) {
      const status = await Kettle.isStarted();
      const identifier = await Kettle.getIdentifier();
      const consents = await Kettle.getGrantedConsents();
      const privacyDashboardUrl = await Kettle.getPrivacyDashboardUrl();
      const privacyTermsUrl = await Kettle.getPrivacyTermsUrl();

      setKettleInfo({
        isKettleStarted: status,
        kettleIdentifier: identifier,
        kettleConsents: consents,
        isBeaconsOnboarded: Object.keys(consents).length > 0,
        privacyDashboardUrl,
        privacyTermsUrl,
      });
    }
  }, [isKettleSDKInitialized, isBeaconsSupported]);

  const onboardForBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return false;

    let granted = false;
    if (Platform.OS === 'ios') {
      // NOTE: This module can be found in /ios/Shared/BeaconsPermissions.swift
      granted = await NativeModules.BeaconsPermissions.request();
    } else {
      granted = await requestAndroidPermissions(getRationaleMessages);
    }

    if (granted) {
      // Initialize beacons SDK after consent is granted
      Kettle.grant(BEACONS_CONSENTS);
      await storage.set(storeKey.beaconsConsent, 'true');
      await updateKettleInfo();
    }

    return granted;
  }, [isBeaconsSupported, getRationaleMessages, updateKettleInfo]);

  const revokeBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (isKettleSDKInitialized) {
      const permissions = await allowedPermissionForKettle();
      Kettle.stop(permissions);
      Kettle.revoke(BEACONS_CONSENTS);
      await storage.set(storeKey.beaconsConsent, 'false');
      await updateKettleInfo();
    }
  }, [isBeaconsSupported, isKettleSDKInitialized, updateKettleInfo]);

  const deleteCollectedData = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (isKettleSDKInitialized) {
      await Kettle.deleteCollectedData();
    }
  }, [isBeaconsSupported, isKettleSDKInitialized]);

  useEffect(() => {
    updateKettleInfo();
  }, [updateKettleInfo]);

  // Initialize SDK
  useEffect(() => {
    async function initializeBeaconsSDK() {
      const permissions = await allowedPermissionForKettle();
      if (
        !isKettleSDKInitialized &&
        isBeaconsSupported &&
        permissions.length > 0
      ) {
        await NativeModules.KettleSDKExtension.initializeKettleSDK();
        setKettleSDKInitialized(true);
        await updateKettleInfo();
      }
    }
    initializeBeaconsSDK();
  }, [isBeaconsSupported, isKettleSDKInitialized, updateKettleInfo]);

  // Start Beacons
  useEffect(() => {
    async function startBeacons() {
      if (!isBeaconsSupported) return;
      if (
        !kettleInfo?.isKettleStarted &&
        isKettleSDKInitialized &&
        kettleInfo?.isBeaconsOnboarded
      ) {
        const permissions = await allowedPermissionForKettle();
        Kettle.start(permissions);
        await updateKettleInfo();
      }
    }
    startBeacons();
  }, [
    isBeaconsSupported,
    kettleInfo,
    isKettleSDKInitialized,
    updateKettleInfo,
  ]);

  return (
    <BeaconsContext.Provider
      value={{
        isKettleSDKInitialized,
        isBeaconsSupported,
        kettleInfo,
        onboardForBeacons,
        revokeBeacons,
        deleteCollectedData,
      }}
    >
      {children}
    </BeaconsContext.Provider>
  );
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
