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

type KettleInfo = {
  isKettleStarted: boolean;
  kettleIdentifier: string | null;
  kettleConsents: Record<string, boolean> | null;
  isBeaconsOnboarded: boolean;
  privacyDashboardUrl?: string;
  privacyTermsUrl?: string;
};

type BeaconsContextState = {
  isBeaconsSupported: boolean;
  kettleInfo?: KettleInfo;
  onboardForBeacons: () => Promise<boolean>;
  revokeBeacons: () => Promise<void>;
  deleteCollectedData: () => Promise<void>;
};

const defaultState = {
  isBeaconsSupported: false,
  kettleInfo: undefined,
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
      Kettle.grant(BEACONS_CONSENTS);
      await storage.set(storeKey.beaconsConsent, 'true');
      await updateKettleInfo();
    }

    return granted;
  }, [isBeaconsSupported, rationaleMessages]);

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
      await Kettle.deleteCollectedData();
    }
  }, [isBeaconsSupported]);

  const isOnboardedButNotStarted =
    !kettleInfo?.isKettleStarted && kettleInfo?.isBeaconsOnboarded;
  useEffect(() => {
    (async function () {
      if (!isBeaconsSupported) return;

      const permissions = await allowedPermissionForKettle();
      if (!isInitializedRef.current) {
        if (permissions.length > 0) {
          await NativeModules.KettleSDKExtension.initializeKettleSDK();
          isInitializedRef.current = true;
        }
      }

      if (isInitializedRef.current && isOnboardedButNotStarted) {
        Kettle.start(permissions);
      }

      await updateKettleInfo();
    })();
  }, [isBeaconsSupported, isOnboardedButNotStarted]);

  return (
    <BeaconsContext.Provider
      value={{
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

const getKettleInfo = async (): Promise<KettleInfo> => {
  const status = await Kettle.isStarted();
  const identifier = await Kettle.getIdentifier();
  const consents = await Kettle.getGrantedConsents();
  const privacyDashboardUrl = await Kettle.getPrivacyDashboardUrl();
  const privacyTermsUrl = await Kettle.getPrivacyTermsUrl();

  return {
    isKettleStarted: status,
    kettleIdentifier: identifier,
    kettleConsents: consents,
    isBeaconsOnboarded: Object.keys(consents).length > 0,
    privacyDashboardUrl,
    privacyTermsUrl,
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