import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import LocationWhenInUsePermissionTexts from '@atb/translations/screens/LocationWhenInUsePermission';
import {MyLocation} from '@atb/assets/svg/color/images';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useAppState} from '@atb/AppContext';
import {OnboardingScreen} from '@atb/onboarding-screen';
import {useGeolocationState} from '@atb/GeolocationContext';

type Props = RootStackScreenProps<'Root_LocationWhenInUsePermissionScreen'>;

export const Root_LocationWhenInUsePermissionScreen = ({navigation}: Props) => {
  const {t} = useTranslation();

  const {completeLocationWhenInUsePermissionOnboarding} = useAppState();
  const {requestLocationPermission} = useGeolocationState();

  const buttonOnPress = useCallback(async () => {
    await requestLocationPermission();
    navigation.popToTop();
    completeLocationWhenInUsePermissionOnboarding();
  }, [
    navigation,
    completeLocationWhenInUsePermissionOnboarding,
    requestLocationPermission,
  ]);

  return (
    <OnboardingScreen
      illustration={<MyLocation height={220} />}
      title={t(LocationWhenInUsePermissionTexts.title)}
      description={t(LocationWhenInUsePermissionTexts.description)}
      buttonText={t(LocationWhenInUsePermissionTexts.button)}
      buttonOnPress={buttonOnPress}
      testID="locationWhenInUsePermission"
    />
  );
};
