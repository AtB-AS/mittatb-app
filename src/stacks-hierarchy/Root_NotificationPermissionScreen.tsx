import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import NotificationPermissionTexts from '@atb/translations/screens/NotificationPermission';
import {PushNotification} from '@atb/assets/svg/color/images';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useAppState} from '@atb/AppContext';
import {OnboardingScreen} from '@atb/onboarding-screen';
import {usePushNotifications} from '@atb/notifications';

type Props = RootStackScreenProps<'Root_NotificationPermissionScreen'>;

export const Root_NotificationPermissionScreen = ({navigation}: Props) => {
  const {t} = useTranslation();

  const {completeNotificationPermissionOnboarding} = useAppState();
  const {requestPermissions} = usePushNotifications();
  const buttonOnPress = useCallback(async () => {
    await requestPermissions();
    navigation.popToTop();
    completeNotificationPermissionOnboarding();
  }, [
    requestPermissions,
    navigation,
    completeNotificationPermissionOnboarding,
  ]);

  return (
    <OnboardingScreen
      illustration={<PushNotification height={220} />}
      title={t(NotificationPermissionTexts.title)}
      description={t(NotificationPermissionTexts.description)}
      buttonText={t(NotificationPermissionTexts.button)}
      buttonOnPress={buttonOnPress}
      testID="notificationPermission"
    />
  );
};
