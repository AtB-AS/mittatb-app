import {useCallback, useEffect} from 'react';
import {NativeModules} from 'react-native';

export const useBeacons = () => {
  const startKettleSDK = useCallback(async () => {
    // This will set kettle if KETTLE_API_KEY is set on the native side
    await NativeModules.KettleSDKExtension.initializeKettleSDK();
  }, []);

  useEffect(() => {
    startKettleSDK();
  }, [startKettleSDK]);

  return {
    startKettleSDK,
  };
};
