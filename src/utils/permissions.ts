import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

let BLUETOOTH_permission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.BLUETOOTH_CONNECT :  PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL;

export const getBluetoothStatus = async () => {
  return await check(BLUETOOTH_permission);
};

export const requestBluetoothPermission = async (callback: (granted: boolean) => void) => {
  const currentStatus = await getBluetoothStatus();

  console.log('currentStatus', currentStatus);

  if (currentStatus === RESULTS.GRANTED) {
    callback(true);
    return;
  }

  const requestStatus = await request(BLUETOOTH_permission);
  return callback(requestStatus === RESULTS.GRANTED);
};