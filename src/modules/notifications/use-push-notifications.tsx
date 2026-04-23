import {useLocaleContext} from '@atb/modules/locale';
import Bugsnag from '@bugsnag/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {NotificationConfigUpdate} from './api';
import {NotificationConfig} from './types';
import {useNotificationConfig} from './use-notification-config';
import {useRegister} from './use-register';
import {getLanguageAndTextEnum} from '@atb/translations/utils';
import {useAuthContext} from '@atb/modules/auth';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'loading'
  | 'updating'
  | 'error';

type NotificationContextState = {
  config: NotificationConfig | undefined;
  updateConfig: (config: NotificationConfigUpdate) => void;
  permissionStatus: NotificationPermissionStatus;
  checkPermissions: () => void;
  requestPermissions: () => Promise<void>;
  register: (enabled: boolean) => Promise<string | undefined>;
  fcmToken: string | undefined;
};

const NotificationContext = createContext<NotificationContextState | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const NotificationContextProvider = ({children}: Props) => {
  const {language} = useLocaleContext();
  const [permissionStatus, setStatus] =
    useState<NotificationPermissionStatus>('loading');
  const [fcmToken, setFcmToken] = useState<string>();
  const {mutation: registerMutation} = useRegister();
  const {mutate: mutateRegister} = registerMutation;
  const {query: configQuery, mutation: configMutation} =
    useNotificationConfig();
  const {isPushNotificationsEnabled} = useFeatureTogglesContext();
  const {authStatus} = useAuthContext();

  const getFcmToken = useCallback(async () => {
    try {
      // Ensures device is registered to Apple for remote messages
      // It should be automatically registered in our workflow
      // but if there are cases where it fails, this should safeguard it.
      // Safe to call on Android, no need to do a platform check.
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }

      // On iOS, wait for the APNs token to be available before requesting
      // the FCM token. registerDeviceForRemoteMessages resolves before the
      // APNs token callback fires, so getToken() can fail without this.
      if (Platform.OS === 'ios') {
        let apnsToken = await messaging().getAPNSToken();
        if (!apnsToken) {
          for (let i = 0; i < 5; i++) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            apnsToken = await messaging().getAPNSToken();
            if (apnsToken) break;
          }
          if (!apnsToken) {
            throw new Error('APNs token not available after waiting');
          }
        }
      }

      const token = await messaging().getToken();
      setFcmToken(token);
      return token;
    } catch (e) {
      // Error is expected in simulator, since push notifications are not supported.
      if (__DEV__) return undefined;
      Bugsnag.notify(
        e instanceof Error ? e : new Error(`Failed to get FCM token: ${e}`),
      );
      return undefined;
    }
  }, []);

  const register = useCallback(
    async (enabled: boolean) => {
      const token = await getFcmToken();
      if (!token) return;
      try {
        mutateRegister({
          token,
          language: getLanguageAndTextEnum(language),
          enabled,
        });
        return token;
      } catch (e) {
        Bugsnag.notify(`Failed to register for push notifications: ${e}`);
      }
    },
    [language, getFcmToken, mutateRegister],
  );

  const checkPermissions = useCallback(() => {
    setStatus('loading');
    if (Platform.OS === 'ios') {
      messaging()
        .hasPermission()
        .then((hasPermission) => {
          const status = mapIosPermissionStatus(hasPermission);
          setStatus(status);
          register(status === 'granted');
        })
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
          const status =
            hasPermission || platformVersion < 33 ? 'granted' : 'denied';
          setStatus(status);
          register(status === 'granted');
        })
        .catch((e) => {
          setStatus('error');
          console.error(e);
        });
    } else {
      setStatus('error');
    }
  }, [register]);

  const requestPermissions = useCallback(async () => {
    setStatus('updating');
    const permissionStatus = await requestUserPermission();
    const token = await register(permissionStatus === 'granted');
    if (!token) {
      setStatus('error');
      return;
    }
    setStatus(permissionStatus);
  }, [register]);

  // Check notification status, and register notification language when the app
  // starts, in case the user have changed language since last time the app was
  // opened. This useEffect will also trigger when language is changed manually
  // in the app.
  useEffect(() => {
    if (isPushNotificationsEnabled && authStatus === 'authenticated')
      checkPermissions();
  }, [isPushNotificationsEnabled, checkPermissions, authStatus]);

  return (
    <NotificationContext.Provider
      value={{
        permissionStatus,
        config: configQuery.data,
        updateConfig: configMutation.mutate,
        checkPermissions,
        requestPermissions,
        register,
        fcmToken,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotificationsContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be used within a NotificationContextProvider',
    );
  }
  return context;
}

async function requestUserPermission(): Promise<NotificationPermissionStatus> {
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
