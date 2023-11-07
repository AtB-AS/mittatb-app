import {useIsBeaconsEnabled} from '@atb/beacons/use-is-beacons-enabled';
import {KETTLE_API_KEY} from '@env';
import {useCallback, useEffect} from 'react';
import {NativeModules} from 'react-native';

export const useBeacons = () => {
  const [isBeaconsEnabled] = useIsBeaconsEnabled();
  const isBeaconsSupported = isBeaconsEnabled && !!KETTLE_API_KEY;

  const initializeBeacons = useCallback(async () => {
    // This will set kettle if KETTLE_API_KEY is set on the native side
    await NativeModules.KettleSDKExtension.initializeKettleSDK();
  }, [NativeModules]);

  useEffect(() => {
    if (isBeaconsSupported) {
      initializeBeacons();
    }
  }, [initializeBeacons, isBeaconsSupported]);

  return {};
};
