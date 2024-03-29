import {NativeModules} from 'react-native';
// Found in ./ios/Modules/ChangeNativeBridge.m
const {ChangeNativeBridge: ChangeNative} = NativeModules;

interface ChangeNativeInterface {
  changeAppearance(mode: 'light' | 'dark' | null | undefined): void;
}

export const RCTChangeNative = ChangeNative as ChangeNativeInterface;
