import {NativeModules} from 'react-native';

// Found in /ios/Modules/WidgetUpdaterBridge.m
interface WidgetUpdaterBridge {
  refreshWidgets(): void;
}

const WidgetUpdaterBridge =
  NativeModules.WidgetUpdaterBridge as WidgetUpdaterBridge;
if (!WidgetUpdaterBridge) {
  throw new Error(
    'WidgetUpdaterBridge module is not linked. Please check your native module setup.',
  );
}

export const refreshWidgets = WidgetUpdaterBridge.refreshWidgets;
