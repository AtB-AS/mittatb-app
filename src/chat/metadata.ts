import Intercom from 'react-native-intercom';
import {PlatformOSType} from 'react-native';
import {PermissionStatus} from 'react-native-permissions';
import pickBy from 'lodash.pickby';

type Metadata = {
  'AtB-Firebase-Auth-Id': string;
  'AtB-Auth-Type': string;
  'AtB-Install-Id': string;
  'AtB-Build-Number': string;
  'AtB-Device-Type': string;
  'AtB-Device-Location-Enabled': boolean;
  'AtB-App-Location-Status': PermissionStatus;
  'AtB-Platform-OS': PlatformOSType;
  'AtB-OS-Font-Scale': number;
  'AtB-Screen-Size': string;
  'AtB-Mobile-Token-Id': string;
  'AtB-Mobile-Token-Status': 'success' | 'error';
  'AtB-Mobile-Token-Error-Correlation-Id': string;
  'AtB-Beta-Departures': string;
  'AtB-Beta-TripSearch': string;
};

export async function updateMetadata(metadata: Partial<Metadata>) {
  const custom_attributes = pickBy(metadata, (v) => v !== undefined) as {
    [key: string]: string;
  };

  await Intercom.updateUser({
    custom_attributes,
  });
}
