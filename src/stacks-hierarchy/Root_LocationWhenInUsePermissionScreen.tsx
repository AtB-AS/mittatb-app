import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import LocationWhenInUsePermissionTexts from '@atb/translations/screens/LocationWhenInUsePermission';
import {MyLocation} from '@atb/assets/svg/color/images';
import {useAppState} from '@atb/AppContext';
import {OnboardingScreenComponent} from '@atb/extended-onboarding-screen';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useOnboardingNavigation} from '@atb/utils/use-onboarding-navigation';

export const Root_LocationWhenInUsePermissionScreen = () => {
  const {t} = useTranslation();

  const {completeLocationWhenInUsePermissionOnboarding} = useAppState();
  const {requestLocationPermission} = useGeolocationState();

  const {continueFromOnboardingScreen} = useOnboardingNavigation();

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
    <OnboardingScreenComponent
      illustration={<MyLocation height={220} />}
      title={t(LocationWhenInUsePermissionTexts.title)}
      description={t(LocationWhenInUsePermissionTexts.description)}
      buttonText={t(LocationWhenInUsePermissionTexts.button)}
      buttonOnPress={buttonOnPress}
      testID="locationWhenInUsePermission"
    />
  );
};
