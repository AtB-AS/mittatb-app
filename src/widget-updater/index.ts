import {NativeModules} from 'react-native';

// Found in ./ios/Modules/WidgetUpdaterBridge.m
const {WidgetUpdaterBridge: WidgetUpdater} = NativeModules;

interface RCTWidgetUpdaterInterface {
  refreshWidgets(): void;
}

export default WidgetUpdater as RCTWidgetUpdaterInterface;
