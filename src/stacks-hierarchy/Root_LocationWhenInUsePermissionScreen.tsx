import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import LocationWhenInUsePermissionTexts from '@atb/translations/screens/LocationWhenInUsePermission';
import {MyLocation} from '@atb/assets/svg/color/images';
import {useAppState} from '@atb/AppContext';
import {OnboardingScreen} from '@atb/onboarding-screen';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useOnboardingNavigationFlow} from '@atb/utils/use-onboarding-navigation-flow';

export const Root_LocationWhenInUsePermissionScreen = () => {
  const {t} = useTranslation();

  const {completeLocationWhenInUsePermissionOnboarding} = useAppState();
  const {requestLocationPermission} = useGeolocationState();

  const {continueFromOnboardingScreen} = useOnboardingNavigationFlow();

  const buttonOnPress = useCallback(async () => {
    await requestLocationPermission();
    completeLocationWhenInUsePermissionOnboarding();
    continueFromOnboardingScreen('Root_LocationWhenInUsePermissionScreen');
  }, [
    completeLocationWhenInUsePermissionOnboarding,
    requestLocationPermission,
    continueFromOnboardingScreen,
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
