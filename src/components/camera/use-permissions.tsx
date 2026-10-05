import {useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import CameraTexts from '@atb/translations/components/Camera';
import {useTranslation} from '@atb/translations';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';

const CAMERA_PERMISSION = Platform.select({
  android: PERMISSIONS.ANDROID.CAMERA,
  ios: PERMISSIONS.IOS.CAMERA,
});

export const usePermissions = () => {
  const {t} = useTranslation();
  const [isAuthorized, setIsAuthorized] = useState<boolean>();
  const appState = useAppStateStatus();
  const isInitialMountRef = useRef(true);

  // `t` is recreated on every render, so it's kept in a ref and read from
  // there in the effect below. This lets the effect run only once per mount
  // without depending on `t`.
  const tRef = useRef(t);
  tRef.current = t;

  // Re-checks (without re-requesting) whenever the app returns to active,
  // e.g. after the user grants access via "Open settings".
  useEffect(() => {
    const isInitialMount = isInitialMountRef.current;
    isInitialMountRef.current = false;

    if (!CAMERA_PERMISSION) {
      setIsAuthorized(false);
      return;
    }
    if (appState !== 'active') {
      return;
    }

    (async () => {
      const granted = await check(CAMERA_PERMISSION);
      if (granted === RESULTS.GRANTED) {
        setIsAuthorized(true);
        return;
      }
      if (!isInitialMount) {
        setIsAuthorized(false);
        return;
      }
      const t = tRef.current;
      const requested = await request(CAMERA_PERMISSION, {
        title: t(CameraTexts.permissionsDialog.title),
        message: t(CameraTexts.permissionsDialog.message),
        buttonPositive: t(CameraTexts.permissionsDialog.action),
      });
      setIsAuthorized(requested === RESULTS.GRANTED);
    })();
  }, [appState]);

  return {isAuthorized};
};
