import { useIsBeaconsEnabled } from './use-is-beacons-enabled';
import { KETTLE_API_KEY } from '@env';
import { useCallback, useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';
import { Kettle, KettleModules } from 'react-native-kettle-module';
import { KettleConsents } from 'react-native-kettle-module';
import { PERMISSIONS, Permission, RESULTS, check, checkMultiple, request } from 'react-native-permissions';

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
  const [isBeaconsEnabled, isBeaconsEnabledDebugOverrideReady] = useIsBeaconsEnabled();
  const [kettleInfo, setKettleInfo] = useState<KettleInfo>();

  const isBeaconsSupported = isBeaconsEnabled && isBeaconsEnabledDebugOverrideReady && !!KETTLE_API_KEY && !!kettleInfo?.kettleConsents;

  const initializeBeacons = useCallback(async () => {
    // This will set kettle if KETTLE_API_KEY is set on the native side
    await NativeModules.KettleSDKExtension.initializeKettleSDK();
  }, [NativeModules]);

  useEffect(() => {
    if (isBeaconsSupported) {
      initializeBeacons();
    }
  }, [initializeBeacons, isBeaconsSupported]);

  useEffect(() => {
    let isMounted = true;

    async function checkKettleInfo() {
      const status = await Kettle.isStarted();
      const identifier = await Kettle.getIdentifier();
      const consents = await Kettle.getGrantedConsents();
      const privacyDashboardUrl = await Kettle.getPrivacyDashboardUrl();
      const privacyTermsUrl = await Kettle.getPrivacyTermsUrl();

      if (isMounted) {
        setKettleInfo({
          isKettleStarted: status,
          kettleIdentifier: identifier,
          kettleConsents: consents,
          isBeaconsOnboarded: Object.keys(consents).length > 0,
          privacyDashboardUrl,
          privacyTermsUrl,
        });
      }
    }

    if (isBeaconsSupported) checkKettleInfo();

    return () => {
      isMounted = false;
    };
  }, [isBeaconsSupported, setKettleInfo]);

  // This function should be called only once and should be called after the user has onboarded for beacons
  const startBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (!kettleInfo.isKettleStarted && kettleInfo.isBeaconsOnboarded) {
      Kettle.start(allowedPermissionForKettle());
    }
  }, [isBeaconsSupported, kettleInfo, allowedPermissionForKettle]);

  const stopBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (kettleInfo.isKettleStarted) {
      Kettle.stop(allowedPermissionForKettle());
    }
  }, [isBeaconsSupported, kettleInfo, allowedPermissionForKettle]);

  const revokeBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (kettleInfo.isKettleStarted) Kettle.revoke(BEACONS_CONSENTS);
  }, [isBeaconsSupported, kettleInfo]);

  const deleteCollectedData = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (kettleInfo.isKettleStarted) Kettle.deleteCollectedData();
  }, [isBeaconsSupported, kettleInfo]);

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
      Kettle.grant(BEACONS_CONSENTS);
    }

    return granted;
  }, [isBeaconsSupported]);

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
