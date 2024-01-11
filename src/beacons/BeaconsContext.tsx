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
  allowedPermissionsForBeacons,
  requestAndroidBeaconPermissions,
} from './permissions';
import {useBeaconsMessages} from './use-beacons-messages';
import {storage} from '@atb/storage';
import {parseBoolean} from '@atb/utils/parse-boolean';
import Bugsnag from '@bugsnag/react-native';

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
};

type BeaconsContextState = {
  beaconsInfo?: BeaconsInfo;
  /**
   * Whether or not the user have granted the app permissions to one of the
   * permission prompts (at least Bluetooth).
   *
   * This is "our" state to know if the user have enabled beacons, not based on
   * data from Kettle. This is because we don't want to start he SDK if the user
   * have not accepted any prompts about data collection.
   */
  isConsentGranted: boolean;
  isBeaconsSupported: boolean;
  revokeBeacons: () => Promise<void>;
  onboardForBeacons: () => Promise<boolean>;
  getPrivacyTermsUrl: () => Promise<string>;
  deleteCollectedData: () => Promise<void>;
  getPrivacyDashboardUrl: () => Promise<string>;
};

const defaultState: BeaconsContextState = {
  beaconsInfo: undefined,
  isConsentGranted: false,
  isBeaconsSupported: false,
  revokeBeacons: () => new Promise<void>(() => undefined),
  onboardForBeacons: () => new Promise<boolean>(() => false),
  getPrivacyTermsUrl: () => new Promise<string>(() => undefined),
  getPrivacyDashboardUrl: () => new Promise<string>(() => undefined),
  deleteCollectedData: () => new Promise<void>(() => undefined),
};

enum storeKey {
  beaconsConsent = '@ATB_beacons_consent_granted',
}

const BeaconsContext = createContext<BeaconsContextState>(defaultState);

const BeaconsContextProvider: React.FC = ({children}) => {
  const {rationaleMessages} = useBeaconsMessages();
  const [beaconsInfo, setBeaconsInfo] = useState<BeaconsInfo>();
  const [isConsentGranted, setIsConsentGranted] = useState<boolean>(false);
  const [isBeaconsEnabled, debugOverrideReady] = useIsBeaconsEnabled();

  const isInitializedRef = useRef(false);
  const isBeaconsSupported =
    isBeaconsEnabled && debugOverrideReady && !!KETTLE_API_KEY;

  const updateBeaconsInfo = () => getBeaconsInfo().then(setBeaconsInfo);

  const initializeKettleSDK = useCallback(
    async (bypassPermissions: boolean) => {
      // By checking permissions we can avoid initializing the SDK if the user
      // have not granted any permissions. This is to avoid the SDK to start
      // collecting data without the user knowing.
      const permissions = await allowedPermissionsForBeacons();
      if (
        !isInitializedRef.current &&
        (permissions.length > 0 || bypassPermissions)
      ) {
        await NativeModules.KettleSDKExtension.initializeKettleSDK();
        isInitializedRef.current = true;
      }
    },
    [],
  );

  const stopBeacons = useCallback(async () => {
    const permissions = await allowedPermissionsForBeacons();
    if (
      permissions.length > 0 &&
      beaconsInfo?.isStarted &&
      isInitializedRef.current
    ) {
      Kettle.stop(permissions);
    }
  }, [beaconsInfo]);

  const getPrivacyDashboardUrl = useCallback(async () => {
    await initializeKettleSDK(true);
    return await Kettle.getPrivacyDashboardUrl();
  }, [initializeKettleSDK]);

  const getPrivacyTermsUrl = useCallback(async () => {
    await initializeKettleSDK(true);
    return await Kettle.getPrivacyTermsUrl();
  }, [initializeKettleSDK]);

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
      await initializeKettleSDK(false);
      Kettle.grant(BEACONS_CONSENTS);
      await storage.set(storeKey.beaconsConsent, 'true');
      await updateBeaconsInfo();
    }

    return granted;
  }, [isBeaconsSupported, rationaleMessages, initializeKettleSDK]);

  const revokeBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    await initializeKettleSDK(true);
    await stopBeacons();
    Kettle.revoke(BEACONS_CONSENTS);
    await storage.set(storeKey.beaconsConsent, 'false');
    await updateBeaconsInfo();
  }, [isBeaconsSupported, stopBeacons, initializeKettleSDK]);

  const deleteCollectedData = useCallback(async () => {
    if (!isBeaconsSupported) return;
    await initializeKettleSDK(true);
    Kettle.deleteCollectedData().catch((error) => {
      Bugsnag.notify(error);
    });
  }, [isBeaconsSupported, initializeKettleSDK]);

  useEffect(() => {
    (async function () {
      if (!isBeaconsSupported) return;
      // Start beacons if consent is granted and permissions are granted
      const permissions = await allowedPermissionsForBeacons();
      if (
        isConsentGranted &&
        permissions.length > 0 &&
        !beaconsInfo?.isStarted
      ) {
        console.log("Starting beacons");
        await initializeKettleSDK(false);
        Kettle.start(permissions);
        await updateBeaconsInfo();
      }
    })();
  }, [isBeaconsSupported, beaconsInfo, isConsentGranted, initializeKettleSDK]);

  useEffect(() => {
    (async function () {
      const isConsentGranted =
        parseBoolean(await storage.get(storeKey.beaconsConsent)) ?? false;
      setIsConsentGranted(isConsentGranted);
    })();
  }, []);

  return (
    <BeaconsContext.Provider
      value={{
        beaconsInfo,
        isConsentGranted,
        isBeaconsSupported,
        revokeBeacons,
        onboardForBeacons,
        getPrivacyTermsUrl,
        deleteCollectedData,
        getPrivacyDashboardUrl,
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
  return {
    isStarted,
    identifier,
    consents,
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
