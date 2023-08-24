import {useEffect} from 'react';
import {NativeModules} from 'react-native';

// Found in ./ios/Modules/PassPresentationBridge.m
const {PassPresentationBridge: PassPresentation} = NativeModules;

interface RCTPassPresentationInterface {
  requestAutomaticPassPresentationSuppression(): void;
  endAutomaticPassPresentationSuppression(): void;
}

export const RCTPassPresentation =
  PassPresentation as RCTPassPresentationInterface;

export function useApplePassPresentationSuppression() {
  useEffect(() => {
    RCTPassPresentation.requestAutomaticPassPresentationSuppression();
    return () => {
      RCTPassPresentation.endAutomaticPassPresentationSuppression();
    };
  }, []);
}
