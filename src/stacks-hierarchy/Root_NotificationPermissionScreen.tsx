import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import NotificationPermissionTexts from '@atb/translations/screens/NotificationPermission';

import {
  OnboardingScreenComponent,
  useOnboardingNavigation,
} from '@atb/onboarding';
import {useNotificationsContext} from '@atb/modules/notifications';
import {ThemedPushNotification} from '@atb/theme/ThemedAssets';

export const Root_NotificationPermissionScreen = () => {
  const {t} = useTranslation();

  const {continueFromOnboardingSection} = useOnboardingNavigation();

  const {requestPermissions} = useNotificationsContext();
  const buttonOnPress = useCallback(async () => {
    await requestPermissions();
    continueFromOnboardingSection('notificationPermission');
  }, [requestPermissions, continueFromOnboardingSection]);

  return (
    <OnboardingScreenComponent
      illustration={<ThemedPushNotification height={214} />}
      title={t(NotificationPermissionTexts.title)}
      description={t(NotificationPermissionTexts.description)}
      buttonText={t(NotificationPermissionTexts.button)}
      buttonOnPress={buttonOnPress}
      testID="notificationPermission"
    />
  );
};
