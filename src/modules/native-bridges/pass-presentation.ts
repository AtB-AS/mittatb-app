import {useEffect} from 'react';
import {NativeModules, Platform} from 'react-native';

// Found in /ios/BridgeModules/PassPresentationBridge.m
interface PassPresentationBridge {
  requestAutomaticPassPresentationSuppression(): void;
  endAutomaticPassPresentationSuppression(): void;
}

const PassPresentationBridge =
  NativeModules.PassPresentationBridge as PassPresentationBridge;
if (Platform.OS === 'ios' && !PassPresentationBridge) {
  throw new Error(
    'PassPresentationBridge module is not linked. Please check your native module setup.',
  );
}

export function useApplePassPresentationSuppression() {
  useEffect(() => {
    if (Platform.OS === 'android') return;
    PassPresentationBridge.requestAutomaticPassPresentationSuppression();
    return () => {
      PassPresentationBridge.endAutomaticPassPresentationSuppression();
    };
  }, []);
}
