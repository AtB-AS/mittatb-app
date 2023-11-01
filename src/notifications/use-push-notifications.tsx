import {
  Notifications,
  Registered,
  RegistrationError,
} from 'react-native-notifications';
import {useEffect, useState} from 'react';
import {useRegisterForPushNotifications} from '@atb/notifications/use-register-for-push-notifications';

export const usePushNotifications = () => {
  const [isPermissionAccepted, setIsPermissionAccepted] = useState<boolean>();
  const [token, setToken] = useState<string>();
  const [isError, setIsError] = useState(false);
  const {
    isError: isRegisterError,
    isLoading,
    mutate,
  } = useRegisterForPushNotifications();

  useEffect(() => {
    Notifications.isRegisteredForRemoteNotifications().then(
      setIsPermissionAccepted,
    );
  }, []);

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [token]);

  const register = () => {
    try {
      Notifications.registerRemoteNotifications();
      Notifications.events().registerRemoteNotificationsRegistered(
        (event: Registered) => {
          setToken(event.deviceToken);
        },
      );
      Notifications.events().registerRemoteNotificationsRegistrationFailed(
        (event: RegistrationError) => {
          console.error(
            `${event.code} ${event.domain} ${event.localizedDescription}`,
          );
          setIsError(true);
        },
      );
      Notifications.events().registerRemoteNotificationsRegistrationDenied(() =>
        setIsPermissionAccepted(false),
      );
    } catch (e) {
      console.error(e);
      setIsError(true);
    }
  };

  return {
    isError: isError || isRegisterError,
    isLoading,
    isPermissionAccepted,
    register,
  };
};

// Notifications.events().registerNotificationReceivedForeground(
//   (notification: Notification, completion) => {
//     console.log(
//       `Notification received in foreground: ${notification.title} : ${notification.body}`,
//     );
//     completion({alert: false, sound: false, badge: false});
//   },
// );
//
// Notifications.events().registerNotificationOpened(
//   (notification: Notification, completion) => {
//     console.log(`Notification opened: ${notification.payload}`);
//     completion();
//   },
// );
