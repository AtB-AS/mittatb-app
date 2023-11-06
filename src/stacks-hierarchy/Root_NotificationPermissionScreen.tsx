import {useTranslation} from '@atb/translations';
import React from 'react';

import NotificationPermissionTexts from '@atb/translations/screens/NotificationPermission';
import {PushNotification} from '@atb/assets/svg/color/images';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useAppState} from '@atb/AppContext';
import {OnboardingScreen} from '@atb/onboarding-screen';

type Props = RootStackScreenProps<'Root_NotificationPermissionScreen'>;

export const Root_NotificationPermissionScreen = ({navigation}: Props) => {
  const {t} = useTranslation();

  const {completeNotificationPermissionOnboarding} = useAppState();

  const handleButtonPress = () => {
    // TODO: add permission logic
    navigation.popToTop();
    completeNotificationPermissionOnboarding();
  };

  return (
    <OnboardingScreen
      illustration={<PushNotification height={220} />}
      title={t(NotificationPermissionTexts.title)}
      description={t(NotificationPermissionTexts.description)}
      buttonText={t(NotificationPermissionTexts.button)}
      buttonOnPress={handleButtonPress}
    />
  );
};
