import {useCallback, useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, NativeModules} from 'react-native';
import CameraTexts from '@atb/translations/components/Camera';
import {useTranslation} from '@atb/translations';
const {CKCameraManager} = NativeModules;

export const usePermissions = () => {
  const {t} = useTranslation();
  const [isAuthorized, setIsAuthorized] = useState<boolean>();

  const requestCameraPermissionAndroid = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: t(CameraTexts.permissionsDialog.title),
          message: t(CameraTexts.permissionsDialog.message),
          buttonPositive: t(CameraTexts.permissionsDialog.action),
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }, [t]);

  const requestCameraPermissionIOS = async () => {
    let authStatus =
      await CKCameraManager.checkDeviceCameraAuthorizationStatus();
    // -1 means 'undetermined'
    if (authStatus === -1) {
      authStatus = await CKCameraManager.requestDeviceCameraAuthorization();
    }
    return authStatus;
  };

  useEffect(() => {
    (async () => {
      const authStatus =
        Platform.OS === 'android'
          ? await requestCameraPermissionAndroid()
          : await requestCameraPermissionIOS();
      setIsAuthorized(authStatus);
    })();
  }, [requestCameraPermissionAndroid]);

  return {isAuthorized};
};
