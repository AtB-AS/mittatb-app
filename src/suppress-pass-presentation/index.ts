import {useEffect} from 'react';
import {NativeModules, Platform} from 'react-native';

// Found in ./ios/Modules/PassPresentationBridge.m
const {PassPresentationBridge: PassPresentation} = NativeModules;

interface RCTPassPresentationInterface {
  requestAutomaticPassPresentationSuppression(): void;
  endAutomaticPassPresentationSuppression(): void;
}
const RCTPassPresentation = PassPresentation as RCTPassPresentationInterface;
export function useApplePassPresentationSuppression() {
  useEffect(() => {
    if (Platform.OS === 'android') return;
    RCTPassPresentation.requestAutomaticPassPresentationSuppression();
    return () => {
      RCTPassPresentation.endAutomaticPassPresentationSuppression();
    };
  }, []);
}
