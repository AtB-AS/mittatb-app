import { storage } from '@atb/storage';
import { useIsBeaconsEnabled } from './use-is-beacons-enabled';
import { KETTLE_API_KEY } from '@env';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeModules, Platform, Rationale } from 'react-native';
import { Kettle, KettleModules } from 'react-native-kettle-module';
import { KettleConsents } from 'react-native-kettle-module';
import { PERMISSIONS, Permission, RESULTS, checkMultiple, request } from 'react-native-permissions';
import { ShareTravelHabitsTexts, dictionary, useTranslation } from '@atb/translations';

enum storeKey {
  beaconsConsent = '@ATB_beacons_consent_granted',
}

type PermissionKey = 'bluetooth' | 'locationWhenInUse' | 'locationAlways' | 'motion';

type RationaleMessages = Record<PermissionKey, Rationale>;

const BEACONS_CONSENTS = [KettleConsents.SURVEYS, KettleConsents.ANALYTICS];
const BEACONS_PERMISSIONS: Record<PermissionKey, Permission> = {
  bluetooth: Platform.OS == 'ios' ? PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL : PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  locationWhenInUse: Platform.OS == 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  locationAlways: Platform.OS == 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  motion: Platform.OS == 'ios' ? PERMISSIONS.IOS.MOTION : PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
};

export type KettleInfo = {
  isKettleStarted: boolean;
  kettleIdentifier: string | null;
  kettleConsents: Record<string, boolean> | null;
  isBeaconsOnboarded: boolean;
  privacyDashboardUrl?: string;
  privacyTermsUrl?: string;
};

export const useBeacons = () => {
  const [isBeaconsEnabled, debugOverrideReady] = useIsBeaconsEnabled();
  const [kettleInfo, setKettleInfo] = useState<KettleInfo>();
  // The kettle SDK was initialized
  const [isKettleSDKInitialized, setKettleSDKInitialized] = useState(false);
  // The app was compiled to support beacons and KEYTLE_API_KEY is set
  const isBeaconsSupported = (isBeaconsEnabled && debugOverrideReady) && !!KETTLE_API_KEY;
  const { t } = useTranslation();

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
  }, [isBeaconsSupported, isKettleSDKInitialized]);

  // This function must be called before consent is granted
  const initializeBeaconsSDK = useCallback(async () => {
    const permissions = await allowedPermissionForKettle();
    // This will set kettle if KETTLE_API_KEY is set on the native side
    if (!isKettleSDKInitialized && isBeaconsSupported && permissions.length > 0) {
      await NativeModules.KettleSDKExtension.initializeKettleSDK();
      setKettleSDKInitialized(true);
    }
  }, [isKettleSDKInitialized, isBeaconsSupported]);

  // This function should be called only once and should be called after the user has onboarded for beacons
  const startBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (!kettleInfo?.isKettleStarted && isKettleSDKInitialized && kettleInfo?.isBeaconsOnboarded) {
      const permissions = await allowedPermissionForKettle();
      Kettle.start(permissions);
    }
  }, [isBeaconsSupported, isKettleSDKInitialized, kettleInfo]);

  const stopBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (kettleInfo?.isKettleStarted && isKettleSDKInitialized) {
      const permissions = await allowedPermissionForKettle();
      Kettle.stop(permissions);
    }
  }, [isBeaconsSupported, isKettleSDKInitialized, kettleInfo]);

  const revokeBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (isKettleSDKInitialized) {
      Kettle.revoke(BEACONS_CONSENTS);
      await storage.set(storeKey.beaconsConsent, "false");
    }
  }, [isBeaconsSupported, isKettleSDKInitialized]);

  const deleteCollectedData = useCallback(() => {
    if (!isBeaconsSupported) return;
    if (isKettleSDKInitialized) {
      Kettle.deleteCollectedData();
    }
  }, [isBeaconsSupported]);

  const getRationaleMessages = useMemo((): RationaleMessages => {
    const buttonPositive = t(dictionary.messageActions.positiveButton);
    return {
      bluetooth: {
        title: t(ShareTravelHabitsTexts.permissions.bluethooth.title),
        message: t(ShareTravelHabitsTexts.permissions.bluethooth.message),
        buttonPositive,
      },
      locationWhenInUse: {
        title: t(ShareTravelHabitsTexts.permissions.locationWhenInUse.title),
        message: t(ShareTravelHabitsTexts.permissions.locationWhenInUse.message),
        buttonPositive,
      },
      locationAlways: {
        title: t(ShareTravelHabitsTexts.permissions.locationAlways.title),
        message: t(ShareTravelHabitsTexts.permissions.locationAlways.message),
        buttonPositive,
      },
      motion: {
        title: t(ShareTravelHabitsTexts.permissions.motion.title),
        message: t(ShareTravelHabitsTexts.permissions.motion.message),
        buttonPositive,
      },
    };
  }, [t]);

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
      await initializeBeaconsSDK().then(async () => {
        Kettle.grant(BEACONS_CONSENTS);
        await storage.set(storeKey.beaconsConsent, "true");
      });
    }

    return granted;
  }, [isBeaconsSupported, initializeBeaconsSDK]);

  useEffect(() => {
    if (isBeaconsSupported && isKettleSDKInitialized) updateKettleInfo();
  }, [isBeaconsSupported, isKettleSDKInitialized, kettleInfo, updateKettleInfo]);

  useEffect(() => {
    async function checkIsBeaconsReadyToBeInitialized() {
      const consentGranted = await storage.get(storeKey.beaconsConsent) ?? "false";
      const isReadyToInitialize = isBeaconsSupported && consentGranted === "true";
      if (isReadyToInitialize) await initializeBeaconsSDK();
    }
    checkIsBeaconsReadyToBeInitialized();
  }, [isBeaconsSupported, initializeBeaconsSDK]);

  return {
    onboardForBeacons,
    startBeacons,
    stopBeacons,
    revokeBeacons,
    deleteCollectedData,
    kettleInfo,
    isBeaconsSupported,
  };
};

const requestAndroidPermissions = async (rationaleMessages: RationaleMessages) => {
  // Request Bluetooth permission
  const bluetoothStatus = await request(
    BEACONS_PERMISSIONS.bluetooth,
    rationaleMessages.bluetooth,
  );

  if (bluetoothStatus !== RESULTS.GRANTED) {
    return false;
  }

  // Request location when in use
  const locationWhenInUseStatus = await request(
    BEACONS_PERMISSIONS.locationWhenInUse,
    rationaleMessages.locationWhenInUse,
  );

  if (locationWhenInUseStatus !== RESULTS.GRANTED) {
    return true;
  }

  // Request location always or background location
  const locationAlwaysStatus = await request(
    BEACONS_PERMISSIONS.locationAlways,
    rationaleMessages.locationAlways,
  );

  if (locationAlwaysStatus !== RESULTS.GRANTED) {
    return true;
  }

  // Request motion permission
  const motionStatus = await request(BEACONS_PERMISSIONS.motion, rationaleMessages.motion);

  if (motionStatus !== RESULTS.GRANTED) {
    return true;
  }

  return true;
};

const checkPermissionStatuses = async () => {
  const statuses = await checkMultiple(Object.values(BEACONS_PERMISSIONS));
  const permissionStatuses: Record<PermissionKey, boolean> = {
    bluetooth: false,
    locationWhenInUse: false,
    locationAlways: false,
    motion: false,
  };
  Object.keys(permissionStatuses).forEach((key) => {
    const permissionKey = key as PermissionKey;
    permissionStatuses[permissionKey] = statuses[BEACONS_PERMISSIONS[permissionKey]] === RESULTS.GRANTED;
  });
  return permissionStatuses;
};

const allowedPermissionForKettle = async () => {
  const permissionStatuses = await checkPermissionStatuses();
  const kettleModulesArray = [];
  if (permissionStatuses.bluetooth) {
    kettleModulesArray.push(KettleModules.BLUETOOTH);
  }
  if (permissionStatuses.locationAlways) {
    kettleModulesArray.push(KettleModules.LOCATION);
  }
  if (permissionStatuses.motion) {
    kettleModulesArray.push(KettleModules.ACTIVITY);
  }

  return kettleModulesArray;
};
