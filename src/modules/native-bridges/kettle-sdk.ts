import {NativeModules} from 'react-native';

// Found in /ios/BridgeModules/KettleSDKExtension.m
interface KettleBridge {
  initializeKettleSDK(): Promise<boolean>;
}

const KettleBridge = NativeModules.KettleSDKExtension as KettleBridge;
if (!KettleBridge) {
  throw new Error(
    'KettleSDKExtension module is not linked. Please check your native module setup.',
  );
}

export const initializeKettleSDK = KettleBridge.initializeKettleSDK;
