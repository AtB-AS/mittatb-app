import {useIsBeaconsEnabled} from '@atb/beacons/use-is-beacons-enabled';
import {KETTLE_API_KEY} from '@env';
import {useCallback, useEffect, useState} from 'react';
import {NativeModules, Platform} from 'react-native';
import {Kettle, KettleModules} from 'react-native-kettle-module';
import {KettleConsents} from 'react-native-kettle-module';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';

const BEACONS_CONSENTS = [KettleConsents.SURVEYS, KettleConsents.ANALYTICS];

export const useBeacons = () => {
  const [isBeaconsEnabled] = useIsBeaconsEnabled();
  const isBeaconsSupported = isBeaconsEnabled && !!KETTLE_API_KEY;

  const [isKettleStarted, setIsKettleStarted] = useState(false);
  const [kettleIdentifier, setKettleIdentifier] = useState(null);
  const [kettleConsents, setKettleConsents] = useState();
  const [isBeaconsOnboarded, setIsBeaconsOnboarded] = useState(false);

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

      if (isMounted) {
        setIsKettleStarted(status);
        setKettleIdentifier(identifier);
        setKettleConsents(consents);
        setIsBeaconsOnboarded(Object.keys(consents).length > 0);
      }
    }

    if (isBeaconsSupported) checkKettleInfo();

    return () => {
      isMounted = false;
    };
  }, [isKettleStarted, kettleIdentifier, kettleConsents, isBeaconsOnboarded]);

  const startBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (!isKettleStarted && isBeaconsOnboarded) {
      Kettle.start([
        KettleModules.LOCATION,
        KettleModules.BLUETOOTH,
        KettleModules.ACTIVITY,
      ]);
    }
  }, [isBeaconsSupported, isKettleStarted, isBeaconsOnboarded]);

  const stopBeacons = useCallback(async () => {
    if (!isBeaconsSupported) return;
    if (isKettleStarted) {
      Kettle.stop([
        KettleModules.LOCATION,
        KettleModules.BLUETOOTH,
        KettleModules.ACTIVITY,
      ]);
    }
  }, [isBeaconsSupported, isKettleStarted]);

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
  }, [startBeacons, isBeaconsSupported]);

  return {
    onboardForBeacons,
    startBeacons,
    stopBeacons,
    isBeaconsOnboarded,
    isKettleStarted,
    kettleIdentifier,
    kettleConsents,
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
