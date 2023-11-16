import {useCallback, useState} from 'react';
import {useRegister} from './use-register';
import {useConfig} from './use-config';
import {PermissionsAndroid, Platform} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useLocaleContext} from '@atb/LocaleProvider';

type NotificationsStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'loading'
  | 'updating'
  | 'error';

export const usePushNotifications = () => {
  const {language} = useLocaleContext();
  const [status, setStatus] = useState<NotificationsStatus>('loading');
  const {mutation: registerMutation} = useRegister();
  const {query: configQuery, mutation: configMutation} = useConfig();

  const checkPermissions = useCallback(() => {
    setStatus('loading');
    if (Platform.OS === 'ios') {
      messaging()
        .hasPermission()
        .then((status) => setStatus(mapIosPermissionStatus(status)))
        .catch((e) => {
          setStatus('error');
          console.error(e);
        });
    } else if (Platform.OS === 'android') {
      const platformVersion = Platform.Version; // Extracted outside promise to make typescript understand it's a number since Platform === 'android'
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
        .then((hasPermission) => {
          // On SDK versions < 33 permission is not required, yet check() will return 'false' for those devices.
          // However, getToken() will yield a device token for sdk < 33 even if check() returns 'false'.
          setStatus(
            hasPermission || platformVersion < 33 ? 'granted' : 'denied',
          );
        })
        .catch((e) => {
          setStatus('error');
          console.error(e);
        });
    } else {
      setStatus('error');
    }
  }, []);

  const register = useCallback(async () => {
    setStatus('updating');
    const permissionStatus = await requestUserPermission();
    const token = await messaging().getToken();
    if (!token) {
      setStatus('error');
      return;
    }
    registerMutation.mutate({token, language});
    setStatus(permissionStatus);
    return token;
  }, [language, registerMutation]);

  return {
    status,
    config: configQuery.data,
    updateConfig: configMutation.mutate,
    checkPermissions,
    register,
  };
};

async function requestUserPermission(): Promise<NotificationsStatus> {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    return mapIosPermissionStatus(authStatus);
  } else if (Platform.OS === 'android') {
    const permissionStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    // Request permission for API level 33+. Not required for 32 or below.
    return Platform.Version < 33
      ? 'granted'
      : mapAndroidPermissionStatus(permissionStatus);
  }
  return 'undetermined';
}

function mapIosPermissionStatus(
  authStatus: FirebaseMessagingTypes.AuthorizationStatus,
) {
  switch (authStatus) {
    case messaging.AuthorizationStatus.AUTHORIZED:
    case messaging.AuthorizationStatus.PROVISIONAL:
    case messaging.AuthorizationStatus.EPHEMERAL:
      return 'granted';
    case messaging.AuthorizationStatus.DENIED:
      return 'denied';
    case messaging.AuthorizationStatus.NOT_DETERMINED:
      return 'undetermined';
    default:
      return 'undetermined';
  }
}

function mapAndroidPermissionStatus(
  permissionStatus: 'granted' | 'denied' | 'never_ask_again',
) {
  switch (permissionStatus) {
    case 'granted':
      return 'granted';
    case 'denied':
    case 'never_ask_again':
      return 'denied';
  }
}
