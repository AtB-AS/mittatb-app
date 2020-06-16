import Intercom from 'react-native-intercom';
import {Platform, PlatformOSType} from 'react-native';
import {PermissionStatus} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import pickBy from 'lodash.pickby';
import storage from '../storage';
import {checkGeolocationPermission} from '../GeolocationContext';

type Metadata = {
  'AtB-Install-Id': string;
  'AtB-Build-Number': string;
  'AtB-Device-Type': string;
  'AtB-Device-Location-Enabled': boolean;
  'AtB-App-Location-Status': PermissionStatus;
  'Atb-Platform-OS': PlatformOSType;
};

export async function register() {
  await Intercom.registerUnidentifiedUser();
  await Intercom.setBottomPadding(Platform.OS === 'ios' ? 40 : 80);

  const installId = await storage.get('install_id');
  const buildNumber = DeviceInfo.getBuildNumber();
  const deviceId = DeviceInfo.getDeviceId();
  const isLocationEnabled = await DeviceInfo.isLocationEnabled();
  const appLocationStatus = await checkGeolocationPermission();

  await updateMetadata({
    'AtB-Install-Id': installId ?? 'unknown',
    'AtB-Build-Number': buildNumber,
    'AtB-Device-Type': deviceId,
    'AtB-Device-Location-Enabled': isLocationEnabled,
    'AtB-App-Location-Status': appLocationStatus,
    'Atb-Platform-OS': Platform.OS,
  });
}

export async function updateMetadata(metadata: Partial<Metadata>) {
  const custom_attributes = pickBy(metadata, (v) => v !== undefined) as {
    [key: string]: string;
  };

  await Intercom.updateUser({
    custom_attributes,
  });
}
