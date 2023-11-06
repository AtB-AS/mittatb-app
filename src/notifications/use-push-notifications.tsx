import {useCallback, useState} from 'react';
import {useRegister} from '@atb/notifications/use-register';
import {useConfig} from '@atb/notifications/use-config';
import {PermissionsAndroid, Platform} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export const usePushNotifications = () => {
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
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
        .then((hasPermission) => {
          //Request Android permission (For API level 33+, for 32 or below is not required)
          setPermissionStatus(
            hasPermission || Number(Platform.Version) < 33
              ? 'granted'
              : 'denied',
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
  }, []);

  const register = async () => {
    const permissionStatus = await requestUserPermission();
    setPermissionStatus(permissionStatus);
    const token = await messaging().getToken();
    if (!token) {
      setIsError(true);
      return;
    }
    registerMutation.mutate(token);
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
    //Request Android permission (For API level 33+, for 32 or below is not required)
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
