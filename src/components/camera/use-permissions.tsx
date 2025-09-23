import {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import CameraTexts from '@atb/translations/components/Camera';
import {useTranslation} from '@atb/translations';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';

const CAMERA_PERMISSION = Platform.select({
  android: PERMISSIONS.ANDROID.CAMERA,
  ios: PERMISSIONS.IOS.CAMERA,
});

export const usePermissions = () => {
  const {t} = useTranslation();
  const [isAuthorized, setIsAuthorized] = useState<boolean>();

  const requestCameraPermission = useCallback(async () => {
    if (!CAMERA_PERMISSION) {
      return RESULTS.UNAVAILABLE;
    }
    const granted = await check(CAMERA_PERMISSION);
    if (granted === RESULTS.GRANTED) {
      return granted;
    }
    return await request(CAMERA_PERMISSION, {
      title: t(CameraTexts.permissionsDialog.title),
      message: t(CameraTexts.permissionsDialog.message),
      buttonPositive: t(CameraTexts.permissionsDialog.action),
    });
  }, [t]);

  useEffect(() => {
    (async () => {
      const authStatus = await requestCameraPermission();
      setIsAuthorized(authStatus === RESULTS.GRANTED);
    })();
  }, [requestCameraPermission]);

  return {isAuthorized};
};
