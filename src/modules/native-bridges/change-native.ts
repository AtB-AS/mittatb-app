import {NativeModules} from 'react-native';

// Found in /ios/BridgeModules/ChangeNativeBridge.m
interface ChangeNativeBridge {
  changeAppearance(mode: 'light' | 'dark' | null | undefined): void;
}

const ChangeNativeBridge =
  NativeModules.ChangeNativeBridge as ChangeNativeBridge;
if (!ChangeNativeBridge) {
  throw new Error(
    'ChangeNativeBridge module is not linked. Please check your native module setup.',
  );
}

export const changeAppearance = ChangeNativeBridge.changeAppearance;
