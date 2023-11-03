import { storage } from '@atb/storage';
import { useIsBeaconsEnabled } from './use-is-beacons-enabled';
import { KETTLE_API_KEY } from '@env';
import { useCallback, useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';
import { Kettle, KettleModules } from 'react-native-kettle-module';
import { KettleConsents } from 'react-native-kettle-module';
import { PERMISSIONS, Permission, RESULTS, check, checkMultiple, request } from 'react-native-permissions';

enum storeKey {
  beaconsConsent = '@ATB_beacons_consent_granted',
}

const BEACONS_CONSENTS = [KettleConsents.SURVEYS, KettleConsents.ANALYTICS];

type PermissionKey = 'bluetooth' | 'location' | 'motion';

const PERMISSIONS_MAP: Record<PermissionKey, Permission> = {
  bluetooth: Platform.OS == 'ios' ? PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  location: Platform.OS == 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
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
    // This will set kettle if KETTLE_API_KEY is set on the native side
    if (!isKettleSDKInitialized && isBeaconsSupported) {
      await NativeModules.KettleSDKExtension.initializeKettleSDK();
      setKettleSDKInitialized(true);
    }
  }, [isKettleSDKInitialized, isBeaconsSupported]);

  // This function should be called only once and should be called after the user has onboarded for beacons
  const startBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (!kettleInfo?.isKettleStarted && isKettleSDKInitialized && kettleInfo?.isBeaconsOnboarded) {
      const permisions = await allowedPermissionForKettle();
      Kettle.start(permisions);
    }
  }, [isBeaconsSupported, isKettleSDKInitialized, kettleInfo]);

  const stopBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (kettleInfo?.isKettleStarted && isKettleSDKInitialized) {
      const permisions = await allowedPermissionForKettle();
      Kettle.stop(permisions);
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

  const onboardForBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return false;

    let granted = false;
    if (Platform.OS === 'ios') {
      // NOTE: This module can be found in /ios/Shared/BeaconsPermissions.swift
      granted = await NativeModules.BeaconsPermissions.request();
    } else {
      granted = await requestAndroidPermissions();
    }

    if (granted) {
      await storage.set(storeKey.beaconsConsent, "true");
      // Initialize beacons SDK after consent is granted
      await initializeBeaconsSDK();
      Kettle.grant(BEACONS_CONSENTS);
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

const requestAndroidPermissions = async () => {
  // Request Bluetooth permission
  const bluetoothStatus = await request(
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  );

  if (bluetoothStatus !== RESULTS.GRANTED) {
    return false;
  }

  // NOTE: If the user already denied the location before, then do not continue asking for more permissions.
  const requestedStatus = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
  if (requestedStatus !== RESULTS.GRANTED) {
    return true;
  }

  // Request location always or background location
  const locationStatus = await request(
    PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  );

  if (locationStatus !== RESULTS.GRANTED) {
    return false;
  }

  // Request motion permission
  const motionStatus = await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);

  if (motionStatus !== RESULTS.GRANTED) {
    return false;
  }

  return true;
};

const checkPermissionStatuses = async () => {
  const statuses = await checkMultiple(Object.values(PERMISSIONS_MAP));
  const permissionStatuses: Record<PermissionKey, boolean> = {
    bluetooth: false,
    location: false,
    motion: false,
  };
  Object.keys(permissionStatuses).forEach((key) => {
    const permissionKey = key as PermissionKey;
    permissionStatuses[permissionKey] = statuses[PERMISSIONS_MAP[permissionKey]] === RESULTS.GRANTED;
  });
  return permissionStatuses;
};

const allowedPermissionForKettle = async () => {
  const permissionStatuses = await checkPermissionStatuses();
  const kettleModulesArray = [];
  if (permissionStatuses.bluetooth) {
    kettleModulesArray.push(KettleModules.BLUETOOTH);
  }
  if (permissionStatuses.location) {
    kettleModulesArray.push(KettleModules.LOCATION);
  }
  if (permissionStatuses.motion) {
    kettleModulesArray.push(KettleModules.ACTIVITY);
  }

  return kettleModulesArray;
};
