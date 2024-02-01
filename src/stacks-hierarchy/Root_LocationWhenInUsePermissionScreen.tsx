import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import LocationWhenInUsePermissionTexts from '@atb/translations/screens/LocationWhenInUsePermission';
import {MyLocation} from '@atb/assets/svg/color/images';
import {OnboardingScreenComponent} from '@atb/onboarding-screen';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useOnboardingNavigation} from '@atb/utils/use-onboarding-navigation';

export const Root_LocationWhenInUsePermissionScreen = () => {
  const {t} = useTranslation();

  const {requestLocationPermission} = useGeolocationState();

  const {continueFromOnboardingSection} = useOnboardingNavigation();

  const buttonOnPress = useCallback(async () => {
    await requestLocationPermission();
    continueFromOnboardingSection('locationWhenInUsePermission');
  }, [requestLocationPermission, continueFromOnboardingSection]);

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
