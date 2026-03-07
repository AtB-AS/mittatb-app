import {NativeModules, Platform} from 'react-native';

// Found in /ios/BridgeModules/ChangeNativeBridge.m
interface ChangeNativeBridge {
  changeAppearance(mode: 'light' | 'dark' | null | undefined): void;
}

const ChangeNativeBridge =
  NativeModules.ChangeNativeBridge as ChangeNativeBridge;
if (!ChangeNativeBridge && Platform.OS === 'ios') {
  throw new Error(
    'ChangeNativeBridge module is not linked. Please check your native module setup.',
  );
}

export const changeAppearance =
  Platform.OS === 'ios' ? ChangeNativeBridge.changeAppearance : () => {};
