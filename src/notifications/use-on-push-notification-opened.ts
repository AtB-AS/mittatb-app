import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {
  firebase,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import {NotificationPayload, NotificationPayloadType} from './types';
import Bugsnag from '@bugsnag/react-native';

export function useOnPushNotificationOpened() {
  const {navigate} = useNavigation<RootNavigationProps>();

  const onMessage = useCallback(
    (message: FirebaseMessagingTypes.RemoteMessage) => {
      const isKnownType = Object.values(NotificationPayloadType).includes(
        message.data?.type as NotificationPayloadType,
      );
      if (!isKnownType) return;

      const messageData = message.data as NotificationPayload;
      switch (messageData.type) {
        case NotificationPayloadType.fareContractExpiry:
          navigate('Root_TabNavigatorStack', {
            screen: 'TabNav_TicketingStack',
            params: {
              screen: 'Ticketing_RootScreen',
              params: {
                screen: 'TicketTabNav_ActiveFareProductsTabScreen',
              },
            },
          });
          return;
        default:
          Bugsnag.leaveBreadcrumb(
            `App was opened with unhandled notification type: ${messageData.type}`,
          );
          return;
      }
    },
    [navigate],
  );

  useEffect(() => {
    // Handle notifications that are clicked while the app is closed (cold start)
    firebase
      .messaging()
      .getInitialNotification()
      .then((m) => (m ? onMessage(m) : null));

    // Handle notifications that are clicked while the app is in the bacground
    const unsubscribe = firebase.messaging().onNotificationOpenedApp(onMessage);
    return unsubscribe;
  }, [onMessage]);
}
