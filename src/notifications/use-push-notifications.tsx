import {
  Notifications,
  Registered,
  RegistrationError,
} from 'react-native-notifications';
import {useEffect, useState} from 'react';
import {useRegister} from '@atb/notifications/use-register';
import {useConfig} from '@atb/notifications/use-config';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';

export const usePushNotifications = () => {
  const [isPermissionAccepted, setIsPermissionAccepted] = useState<boolean>();
  const [token, setToken] = useState<string>();
  const [isError, setIsError] = useState(false);
  const isFocusedAndActive = useIsFocusedAndActive();
  const {mutation: registerMutation} = useRegister();
  const {query: configQuery} = useConfig();
  const {mutation: configMutation} = useConfig();

  useEffect(() => {
    // Check if the user has granted permission to use push notifications on os level
    // "Resubscribe" to this callback when isFocusedAndActive has changed in order to refresh
    // isPermissionAccepted if the user has enabled/disabled push in Settings and then returns to the app.
    if (isFocusedAndActive) {
      Notifications.isRegisteredForRemoteNotifications().then(
        (isRegistered) => {
          setIsPermissionAccepted(isRegistered);
        },
      );
    }
  }, [Notifications, isFocusedAndActive]);

  useEffect(() => {
    if (token) {
      registerMutation.mutate(token);
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
    isError:
      isError ||
      registerMutation.isError ||
      configQuery.isError ||
      configMutation.isError,
    isLoading:
      registerMutation.isLoading ||
      configQuery.isInitialLoading ||
      configMutation.isLoading,
    isPermissionAccepted,
    config: configQuery.data,
    updateConfig: configMutation.mutate,
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
