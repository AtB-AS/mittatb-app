import Intercom from 'react-native-intercom';
import {Dimensions, PixelRatio, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {storage} from '@atb/storage';
import {checkGeolocationPermission} from '@atb/GeolocationContext';
import {updateMetadata} from './metadata';

export async function register() {
  await Intercom.registerUnidentifiedUser();
  await Intercom.setBottomPadding(Platform.OS === 'ios' ? 40 : 80);

  const installId = await storage.get('install_id');
  const buildNumber = DeviceInfo.getBuildNumber();
  const deviceId = DeviceInfo.getDeviceId();
  const isLocationEnabled = await DeviceInfo.isLocationEnabled();
  const appLocationStatus = await checkGeolocationPermission();
  const {width, height} = Dimensions.get('window');

  await updateMetadata({
    'AtB-Install-Id': installId ?? 'unknown',
    'AtB-Build-Number': buildNumber,
    'AtB-Device-Type': deviceId,
    'AtB-Device-Location-Enabled': isLocationEnabled,
    'AtB-App-Location-Status': appLocationStatus,
    'AtB-Platform-OS': Platform.OS,
    'AtB-OS-Font-Scale': PixelRatio.getFontScale(),
    'AtB-Screen-Size': `${width}x${height}`,
  });
}
