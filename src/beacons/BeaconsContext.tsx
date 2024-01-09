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
  allowedPermissionForBeacons,
  requestAndroidBeaconPermissions,
} from './permissions';
import {useBeaconsMessages} from './use-beacons-messages';
import {storage} from '@atb/storage';
import {parseBoolean} from '@atb/utils/parse-boolean';

type BeaconsInfo = {
  /**
   * If the Kettle SDK is currently running.
   * https://developer.kogenta.com/docs/kettle/react-native/usage#retrieve-sdk-status
   */
  isStarted: boolean;

  /**
   * Kettle UUID for the user.
   * https://developer.kogenta.com/docs/kettle/react-native/usage#kettle-identifier
   */
  identifier: string | null;

  /**
   * A list of consents currently granted to Kettle. See `KettleConsents` for
   * definitions. Not to be confused with permissions.
   * https://developer.kogenta.com/docs/kettle/react-native/usage#consents
   */
  consents: Record<string, boolean> | null;

  /**
   * Whether or not the user have granted the app permissions to one of the
   * permission prompts (at least Bluetooth).
   *
   * This is "our" state to know if the user have enabled beacons, not based on
   * data from Kettle. This is because we don't want to start he SDK if the user
   * have not accepted any prompts about data collection.
   */
  isConsentGranted: boolean;
};

type BeaconsContextState = {
  isBeaconsSupported: boolean;
  beaconsInfo?: BeaconsInfo;
  onboardForBeacons: () => Promise<boolean>;
  revokeBeacons: () => Promise<void>;
  deleteCollectedData: () => Promise<void>;
  getPrivacyDashboardUrl: () => Promise<string>;
  getPrivacyTermsUrl: () => Promise<string>;
};

const defaultState: BeaconsContextState = {
  isBeaconsSupported: false,
  beaconsInfo: undefined,
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
  const [beaconsInfo, setBeaconsInfo] = useState<BeaconsInfo>();

  const updateBeaconsInfo = () => getBeaconsInfo().then(setBeaconsInfo);

  const initializeKettleSDK = useCallback(async () => {
    if (!isInitializedRef.current) {
      const permissions = await allowedPermissionForBeacons();
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
      await updateBeaconsInfo();
    }

    return granted;
  }, [isBeaconsSupported, rationaleMessages, initializeKettleSDK]);

  const revokeBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (isInitializedRef.current) {
      const permissions = await allowedPermissionForBeacons();
      Kettle.stop(permissions);
      Kettle.revoke(BEACONS_CONSENTS);
      await storage.set(storeKey.beaconsConsent, 'false');
      await updateBeaconsInfo();
    }
  }, [isBeaconsSupported]);

  const deleteCollectedData = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (isInitializedRef.current) {
      await Kettle.deleteCollectedData();
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

      const permissions = await allowedPermissionForBeacons();
      if (consentGranted && permissions && !beaconsInfo?.isStarted) {
        Kettle.start(permissions);
        await updateBeaconsInfo();
      }
    })();
  }, [isBeaconsSupported, initializeKettleSDK, beaconsInfo]);

  return (
    <BeaconsContext.Provider
      value={{
        isBeaconsSupported,
        beaconsInfo,
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

const getBeaconsInfo = async (): Promise<BeaconsInfo> => {
  const isStarted = await Kettle.isStarted();
  const identifier = await Kettle.getIdentifier();
  const consents = await Kettle.getGrantedConsents();
  const isConsentGranted =
    parseBoolean(await storage.get(storeKey.beaconsConsent)) ?? false;

  return {
    isStarted,
    identifier,
    consents,
    isConsentGranted,
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
