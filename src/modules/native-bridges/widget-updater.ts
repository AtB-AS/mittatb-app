import {NativeModules, Platform} from 'react-native';

// Found in /ios/BridgeModules/WidgetUpdaterBridge.m
interface WidgetUpdaterBridge {
  refreshWidgets(): void;
}

const WidgetUpdaterBridge =
  NativeModules.WidgetUpdaterBridge as WidgetUpdaterBridge;
if (Platform.OS === 'ios' && !WidgetUpdaterBridge) {
  throw new Error(
    'WidgetUpdaterBridge module is not linked. Please check your native module setup.',
  );
}

export const refreshWidgets =
  Platform.OS === 'ios' ? WidgetUpdaterBridge.refreshWidgets : () => {};
