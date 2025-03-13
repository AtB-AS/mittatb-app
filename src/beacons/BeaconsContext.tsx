import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {KETTLE_API_KEY} from '@env';
import {Kettle} from 'react-native-kettle-module';
import {NativeModules, Platform} from 'react-native';
import {
  BEACONS_CONSENTS,
  KettleModulesForBeacons,
  allowedPermissionsForBeacons,
  requestAndroidBeaconPermissions,
} from './permissions';
import {useBeaconsMessages} from './use-beacons-messages';
import {storage} from '@atb/storage';
import {parseBoolean} from '@atb/utils/parse-boolean';
import Bugsnag from '@bugsnag/react-native';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

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
  /**
   * Stops the SDK from collecting data, and sets isConsentGranted to false
   */
  revokeBeacons: () => Promise<void>;
  /**
   * Onboard the user for beacons by asking for permissions if possible. If
   * permissions are granted, the Kettle SDK will be started, and beaconsInfo
   * will be initialized. `shareTravelHabitsOnboarded` will also be set to true.
   *
   * @param alreadyConsented When true, consent will be set to true regardless
   * of permissions. Otherwise permissions will determine consent.
   * @returns Whether or not the user have granted permissions
   */
  onboardForBeacons: (alreadyConsented: boolean) => Promise<boolean>;
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

type Props = {
  children: React.ReactNode;
};

const BeaconsContextProvider = ({children}: Props) => {
  const {rationaleMessages} = useBeaconsMessages();
  const [beaconsInfo, setBeaconsInfo] = useState<BeaconsInfo>();
  const [isConsentGranted, setIsConsentGranted] = useState<boolean>(false);
  const {isBeaconsEnabled} = useFeatureTogglesContext();

  const isInitializedRef = useRef(false);
  const isBeaconsSupported = isBeaconsEnabled && !!KETTLE_API_KEY;

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

  const stopBeacons = useCallback(() => {
    if (beaconsInfo?.isStarted && isInitializedRef.current) {
      // Stop all the modules regardless of the permissions
      // to avoid a bug where the SDK is not stopped properly
      // when the user revokes the permissions.
      Kettle.stop(KettleModulesForBeacons);
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

  const onboardForBeacons = useCallback(
    async (alreadyConsented: boolean) => {
      if (!isBeaconsSupported) return false;

      if (alreadyConsented) {
        await storage.set(storeKey.beaconsConsent, 'true');
        setIsConsentGranted(true);
      }

      let permissionsGranted = false;
      if (Platform.OS === 'ios') {
        // NOTE: This module can be found in /ios/Shared/BeaconsPermissions.swift
        permissionsGranted = await NativeModules.BeaconsPermissions.request();
      } else {
        permissionsGranted = await requestAndroidBeaconPermissions(
          rationaleMessages,
        );
      }
      if (permissionsGranted) {
        // Initialize beacons SDK after consent is granted
        await initializeKettleSDK(false);
        if (isInitializedRef.current) {
          Kettle.grant(BEACONS_CONSENTS);
          await updateBeaconsInfo();
        }

        // If consent wasn't set above, set it to true now
        if (!alreadyConsented) {
          await storage.set(storeKey.beaconsConsent, 'true');
          setIsConsentGranted(true);
        }
      }

      return permissionsGranted;
    },
    [isBeaconsSupported, rationaleMessages, initializeKettleSDK],
  );

  const revokeBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    await initializeKettleSDK(true);
    stopBeacons();
    Kettle.revoke(BEACONS_CONSENTS);
    await storage.set(storeKey.beaconsConsent, 'false');
    setIsConsentGranted(false);
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
      if (!isBeaconsSupported) {
        // If beacons became unsupported, stop the SDK if it was initialized
        // this case can happen when the `enable_beacons` remote config is set to false
        // when the app is already onboarded for beacons.
        if (isInitializedRef.current) {
          stopBeacons();
          await updateBeaconsInfo();
        }
        return;
      }

      // Start beacons if consent is granted and permissions are granted
      const permissions = await allowedPermissionsForBeacons();
      if (
        isConsentGranted &&
        permissions.length > 0 &&
        !beaconsInfo?.isStarted
      ) {
        await initializeKettleSDK(false);
        if (!isInitializedRef.current) {
          return;
        }

        // If the user have given consents, but permissions were enabled later,
        // the consents are not necessarily set in the SDK. So we check the SDKs
        // list of granted consents and grant if they are not set.
        const consents: any[] = await Kettle.getGrantedConsents();
        if (consents.length === 0) {
          Kettle.grant(BEACONS_CONSENTS);
        }

        Kettle.start(permissions);
        await updateBeaconsInfo();
      }
    })();
  }, [
    isBeaconsSupported,
    beaconsInfo,
    isConsentGranted,
    initializeKettleSDK,
    stopBeacons,
  ]);

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

export function useBeaconsContext() {
  const context = useContext(BeaconsContext);
  if (context === undefined) {
    throw new Error(
      'useBeaconsState must be used within an useBeaconsStateProvider',
    );
  }
  return context;
}

export {BeaconsContextProvider};
