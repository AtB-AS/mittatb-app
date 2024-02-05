import {useLocaleContext} from '@atb/LocaleProvider';
import Bugsnag from '@bugsnag/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {NotificationConfigUpdate} from './api';
import {NotificationConfig} from './types';
import {useConfig} from './use-config';
import {useRegister} from './use-register';
import {getLanguageAndTextEnum} from '@atb/translations/utils';
import {usePushNotificationsEnabled} from '@atb/notifications/use-push-notifications-enabled';
import {useAuthState} from '@atb/auth';

type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined'
  | 'loading'
  | 'updating'
  | 'error';

type NotificationContextState = {
  config: NotificationConfig | undefined;
  updateConfig: (config: NotificationConfigUpdate) => void;
  permissionStatus: PermissionStatus;
  checkPermissions: () => void;
  requestPermissions: () => Promise<void>;
  register: (enabled: boolean) => Promise<string | undefined>;
  fcmToken: string | undefined;
};

const NotificationContext = createContext<NotificationContextState | undefined>(
  undefined,
);

export const NotificationContextProvider: React.FC = ({children}) => {
  const {language} = useLocaleContext();
  const [permissionStatus, setStatus] = useState<PermissionStatus>('loading');
  const [fcmToken, setFcmToken] = useState<string>();
  const {mutation: registerMutation} = useRegister();
  const mutateRegister = registerMutation.mutate;
  const {query: configQuery, mutation: configMutation} = useConfig();
  const pushNotificationsEnabled = usePushNotificationsEnabled();
  const {authStatus} = useAuthState();

  const register = useCallback(
    async (enabled: boolean) => {
      if (!fcmToken) return;
      try {
        mutateRegister({
          token: fcmToken,
          language: getLanguageAndTextEnum(language),
          enabled,
        });
        return fcmToken;
      } catch (e) {
        Bugsnag.notify(`Failed to register for push notifications: ${e}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, fcmToken],
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
    if (pushNotificationsEnabled && authStatus === 'authenticated')
      checkPermissions();
  }, [pushNotificationsEnabled, checkPermissions, authStatus]);

  useEffect(() => {
    (async function () {
      const token = await messaging().getToken();
      if (!token) return;
      setFcmToken(token);
    })();
  }, []);

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

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationContextState must be used within a NotificationContextProvider',
    );
  }
  return context;
}

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
  }
}
