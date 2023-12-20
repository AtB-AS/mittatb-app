import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import NotificationPermissionTexts from '@atb/translations/screens/NotificationPermission';
import {PushNotification} from '@atb/assets/svg/color/images';

import {useAppState} from '@atb/AppContext';
import {OnboardingScreen} from '@atb/onboarding-screen';
import {useNotifications} from '@atb/notifications';
import {useOnboardingNavigationFlow} from '@atb/utils/use-onboarding-navigation-flow';

export const Root_NotificationPermissionScreen = () => {
  const {t} = useTranslation();

  const {continueFromOnboardingScreen} = useOnboardingNavigationFlow();

  const {completeNotificationPermissionOnboarding} = useAppState();
  const {requestPermissions} = useNotifications();
  const buttonOnPress = useCallback(async () => {
    await requestPermissions();
    completeNotificationPermissionOnboarding();
    continueFromOnboardingScreen('Root_NotificationPermissionScreen');
  }, [
    requestPermissions,
    completeNotificationPermissionOnboarding,
    continueFromOnboardingScreen,
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
