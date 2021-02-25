import {NativeModules} from 'react-native';
// Found in ./ios/ChangeNativeBridge.m
const {ChangeNativeBridge: ChangeNative} = NativeModules;
interface ChangeNativeInterface {
  changeAppearance(mode: 'light' | 'dark' | null | undefined): void;
}
export default ChangeNative as ChangeNativeInterface;
