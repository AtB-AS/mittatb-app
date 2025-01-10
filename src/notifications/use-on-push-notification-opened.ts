import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {
  firebase,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import {PushNotificationPayloadType, PushNotificationData} from './types';
import Bugsnag from '@bugsnag/react-native';

export function useOnPushNotificationOpened() {
  const navigation = useNavigation<RootNavigationProps>();

  const onMessage = useCallback(
    (message: FirebaseMessagingTypes.RemoteMessage) => {
      const payload = PushNotificationData.safeParse(message.data);
      if (!payload.success) {
        Bugsnag.leaveBreadcrumb(
          `App was opended with unhandled notification type ${message.data?.type}`,
        );
        return;
      }
      if (!navigation.isFocused()) return; // avoid navigating away from e.g. login or permission screens

      const messageData = payload.data;
      switch (messageData.type) {
        case PushNotificationPayloadType.activeFareContracts:
          navigation.navigate('Root_TabNavigatorStack', {
            screen: 'TabNav_TicketingStack',
            params: {
              screen: 'Ticketing_RootScreen',
              params: {
                screen: 'TicketTabNav_AvailableFareContractsTabScreen',
              },
            },
          });
          return;
      }
    },
    [navigation],
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
