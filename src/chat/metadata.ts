import Intercom from 'react-native-intercom';
import {PlatformOSType} from 'react-native';
import {PermissionStatus} from 'react-native-permissions';
import pickBy from 'lodash.pickby';

type Metadata = {
  'AtB-Install-Id': string;
  'AtB-Build-Number': string;
  'AtB-Device-Type': string;
  'AtB-Device-Location-Enabled': boolean;
  'AtB-App-Location-Status': PermissionStatus;
  'Atb-Platform-OS': PlatformOSType;
};

export async function updateMetadata(metadata: Partial<Metadata>) {
  const custom_attributes = pickBy(metadata, (v) => v !== undefined) as {
    [key: string]: string;
  };

  await Intercom.updateUser({
    custom_attributes,
  });
}
