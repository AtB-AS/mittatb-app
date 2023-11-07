import {useCallback, useState} from 'react';
import {useRegister} from '@atb/push-notifications/use-register';
import {useConfig} from '@atb/push-notifications/use-config';
import {PermissionsAndroid, Platform} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {usePreferences} from '@atb/preferences';

type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export const usePushNotifications = () => {
  const {
    preferences: {language = 'nb'},
  } = usePreferences();
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('undetermined');
  const [isLoadingPermissionStatus, setIsLoadingPermissionStatus] =
    useState<boolean>();
  const [isError, setIsError] = useState(false);
  const {mutation: registerMutation} = useRegister();
  const {query: configQuery} = useConfig();
  const {mutation: configMutation} = useConfig();

  const checkPermissions = useCallback(() => {
    setIsLoadingPermissionStatus(true);
    if (Platform.OS === 'ios') {
      messaging()
        .hasPermission()
        .then((status) => setPermissionStatus(mapIosPermissionStatus(status)))
        .catch((e) => {
          setIsError(true);
          console.error(e);
        })
        .finally(() => setIsLoadingPermissionStatus(false));
    } else if (Platform.OS === 'android') {
      const platformVersion = Platform.Version; // Extracted outside promise to make typescript understand it's a number since Platform === 'android'
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
        .then((hasPermission) => {
          // On SDK versions < 33 permission is not required, yet check() will return 'false' for those devices.
          // However, getToken() will yield a device token for sdk < 33 even if check() returns 'false'.
          setPermissionStatus(
            hasPermission || platformVersion < 33 ? 'granted' : 'denied',
          );
        })
        .catch((e) => {
          setIsError(true);
          console.error(e);
        })
        .finally(() => setIsLoadingPermissionStatus(false));
    } else {
      setIsLoadingPermissionStatus(false);
      setIsError(true);
    }
  }, [Platform, messaging, PermissionsAndroid]);

  const register = async () => {
    const permissionStatus = await requestUserPermission();
    setPermissionStatus(permissionStatus);
    const token = await messaging().getToken();
    if (!token) {
      setIsError(true);
      return;
    }
    registerMutation.mutate({token, language});
  };

  return {
    isError:
      isError ||
      registerMutation.isError ||
      configQuery.isError ||
      configMutation.isError,
    isLoading: isLoadingPermissionStatus || configQuery.isInitialLoading,
    isUpdating: registerMutation.isLoading || configMutation.isLoading,
    permissionStatus,
    config: configQuery.data,
    updateConfig: configMutation.mutate,
    checkPermissions,
    register,
  };
};

async function requestUserPermission(): Promise<PermissionStatus> {
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
    default:
      return 'undetermined';
  }
}
