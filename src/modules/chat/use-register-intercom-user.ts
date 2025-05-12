import Intercom from '@intercom/intercom-react-native';
import {Dimensions, PixelRatio, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {storage} from '@atb/modules/storage';
import {checkGeolocationPermission} from '@atb/modules/geolocation';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {useEffect} from 'react';
import {useIntercomMetadata} from './use-intercom-metadata';

export function useRegisterIntercomUser() {
  const {enable_intercom} = useRemoteConfigContext();
  const {updateMetadata} = useIntercomMetadata();

  useEffect(() => {
    const register = async () => {
      try {
        await Intercom.loginUnidentifiedUser();
      } catch (error: any) {
        // do nothing
      }
      await Intercom.setBottomPadding(Platform.OS === 'ios' ? 40 : 80);
    };

    const setMetadata = async () => {
      const installId = await storage.get('install_id');
      const buildNumber = DeviceInfo.getBuildNumber();
      const deviceId = DeviceInfo.getDeviceId();
      const isLocationEnabled = await DeviceInfo.isLocationEnabled();
      const appLocationStatus = await checkGeolocationPermission();
      const {width, height} = Dimensions.get('window');

      updateMetadata({
        'AtB-Install-Id': installId ?? 'unknown',
        'AtB-Build-Number': buildNumber,
        'AtB-Device-Type': deviceId,
        'AtB-Device-Location-Enabled': isLocationEnabled,
        'AtB-App-Location-Status': appLocationStatus,
        'AtB-Platform-OS': Platform.OS,
        'AtB-OS-Font-Scale': PixelRatio.getFontScale(),
        'AtB-Screen-Size': `${width}x${height}`,
      });
    };

    if (enable_intercom) {
      register().then(setMetadata);
    }
  }, [enable_intercom, updateMetadata]);
}
