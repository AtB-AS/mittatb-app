import storage from '../storage';
import {v4 as uuid} from 'uuid';
import bugsnag from '../diagnostics/bugsnag';
import Intercom from 'react-native-intercom';
import DeviceInfo from 'react-native-device-info';
import {setInstallId as setApiInstallId} from '../api/client';
import {Platform} from 'react-native';

type Config = {
  installId: string;
};

export async function loadLocalConfig(): Promise<Config> {
  let installId = await storage.get('install_id');
  if (!installId) {
    installId = uuid();
    await storage.set('install_id', installId);
  }

  configBugsnagUser(installId);
  configApi(installId);
  await configIntercom(installId);

  return {installId};
}

function configBugsnagUser(installId: string) {
  bugsnag.setUser(installId);
}

function configApi(installId: string) {
  setApiInstallId(installId);
}

async function configIntercom(installId: string) {
  const buildNumber = DeviceInfo.getBuildNumber();
  const deviceId = DeviceInfo.getDeviceId();
  const isLocationEnabled = await DeviceInfo.isLocationEnabled();

  Intercom.updateUser({
    custom_attributes: {
      'AtB-Install-Id': installId,
      'AtB-Build-Number': buildNumber,
      'AtB-Device-Id': deviceId,
      'AtB-Location-Enabled': isLocationEnabled ? 'Yes' : 'No',
      'Atb-Platform-OS': Platform.OS,
    },
  });
}
