import Intercom from '@intercom/intercom-react-native';
import {PlatformOSType} from 'react-native';
import {PermissionStatus} from 'react-native-permissions';
import pickBy from 'lodash.pickby';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {useCallback} from 'react';

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
  'AtB-Mobile-Token-Status': 'attested' | 'non-attested' | 'error';
  'AtB-Mobile-Token-Error-Correlation-Id': string;
  'AtB-Beta-TripSearch': string;
};

export const useIntercomMetadata = () => {
  const {enable_intercom} = useRemoteConfigContext();

  const updateMetadata = useCallback(
    async function (metadata: Partial<Metadata>) {
      if (enable_intercom) {
        await Intercom.updateUser({
          customAttributes: pickBy(metadata, (v) => v !== undefined) as {
            [key: string]: string;
          },
        });
      }
    },
    [enable_intercom],
  );

  return {updateMetadata};
};
