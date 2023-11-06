import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import LocationWhenInUsePermissionTexts from '@atb/translations/screens/LocationWhenInUsePermission';
import {PushNotification} from '@atb/assets/svg/color/images';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useAppState} from '@atb/AppContext';
import {OnboardingScreen} from '@atb/onboarding-screen';

type Props = RootStackScreenProps<'Root_LocationWhenInUsePermissionScreen'>;

export const Root_LocationWhenInUsePermissionScreen = ({navigation}: Props) => {
  const {t} = useTranslation();

  const {completeLocationWhenInUsePermissionOnboarding} = useAppState();

  const buttonOnPress = useCallback(() => {
    // TODO: add permission logic
    navigation.popToTop();
    completeLocationWhenInUsePermissionOnboarding();
  }, [navigation, completeLocationWhenInUsePermissionOnboarding]);

  return (
    <OnboardingScreen
      // todo: switch PushNotification icon to MyLocation
      illustration={<PushNotification height={220} />}
      title={t(LocationWhenInUsePermissionTexts.title)}
      description={t(LocationWhenInUsePermissionTexts.description)}
      buttonText={t(LocationWhenInUsePermissionTexts.button)}
      buttonOnPress={buttonOnPress}
    />
  );
};
