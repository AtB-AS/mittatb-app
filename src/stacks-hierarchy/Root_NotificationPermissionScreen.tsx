import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import NotificationPermissionTexts from '@atb/translations/screens/NotificationPermission';
import {PushNotification} from '@atb/assets/svg/color/images';

import {OnboardingScreenComponent} from '@atb/onboarding-screen';
import {useNotifications} from '@atb/notifications';
import {useOnboardingNavigation} from '@atb/utils/use-onboarding-navigation';

export const Root_NotificationPermissionScreen = () => {
  const {t} = useTranslation();

  const {continueFromOnboardingSection} = useOnboardingNavigation();

  const {requestPermissions} = useNotifications();
  const buttonOnPress = useCallback(async () => {
    await requestPermissions();
    continueFromOnboardingSection('notificationPermission');
  }, [requestPermissions, continueFromOnboardingSection]);

  return (
    <OnboardingScreenComponent
      illustration={<PushNotification height={220} />}
      title={t(NotificationPermissionTexts.title)}
      description={t(NotificationPermissionTexts.description)}
      buttonText={t(NotificationPermissionTexts.button)}
      buttonOnPress={buttonOnPress}
      testID="notificationPermission"
    />
  );
};
