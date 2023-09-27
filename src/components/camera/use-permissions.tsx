import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, NativeModules} from 'react-native';
const {CKCameraManager} = NativeModules;

export const usePermissions = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>();

  const requestCameraPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
          buttonPositive: 'Accept',
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestCameraPermissionIOS = async () => {
    let authStatus =
      await CKCameraManager.checkDeviceCameraAuthorizationStatus();
    if (authStatus === -1) {
      authStatus = await CKCameraManager.checkDeviceCameraAuthorizationStatus();
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
  }, []);

  return {isAuthorized};
};
