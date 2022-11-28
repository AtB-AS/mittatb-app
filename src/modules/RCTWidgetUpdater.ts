import {NativeModules} from 'react-native';
const {RCTWidgetUpdater} = NativeModules;

interface RCTWidgetUpdaterInterface {
  refreshWidgets(): void;
}

export default RCTWidgetUpdater as RCTWidgetUpdaterInterface;
