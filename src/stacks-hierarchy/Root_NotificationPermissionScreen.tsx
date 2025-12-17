import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import NotificationPermissionTexts from '@atb/translations/screens/NotificationPermission';

import {
  OnboardingScreenComponent,
  useOnboardingNavigation,
} from '@atb/modules/onboarding';
import {useNotificationsContext} from '@atb/modules/notifications';
import {ThemedPushNotification} from '@atb/theme/ThemedAssets';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {RootStackScreenProps} from './navigation-types';

type Props = RootStackScreenProps<'Root_NotificationPermissionScreen'>;

export const Root_NotificationPermissionScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
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
      footerButton={{
        onPress: buttonOnPress,
        text: t(NotificationPermissionTexts.button),
        expanded: true,
      }}
      testID="notificationPermission"
      focusRef={focusRef}
    />
  );
};
