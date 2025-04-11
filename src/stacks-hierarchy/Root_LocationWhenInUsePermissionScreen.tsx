import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';

import LocationWhenInUsePermissionTexts from '@atb/translations/screens/LocationWhenInUsePermission';
import {
  OnboardingScreenComponent,
  useOnboardingNavigation,
} from '@atb/onboarding';
import {useGeolocationContext} from '@atb/GeolocationContext';
import {ThemedMyLocation} from '@atb/theme/ThemedAssets';

export const Root_LocationWhenInUsePermissionScreen = () => {
  const {t} = useTranslation();

  const {requestLocationPermission} = useGeolocationContext();

  const {continueFromOnboardingSection} = useOnboardingNavigation();

  const buttonOnPress = useCallback(async () => {
    await requestLocationPermission();
    continueFromOnboardingSection('locationWhenInUsePermission');
  }, [requestLocationPermission, continueFromOnboardingSection]);

  return (
    <OnboardingScreenComponent
      illustration={<ThemedMyLocation height={220} />}
      title={t(LocationWhenInUsePermissionTexts.title)}
      description={t(LocationWhenInUsePermissionTexts.description)}
      buttonText={t(LocationWhenInUsePermissionTexts.button)}
      buttonOnPress={buttonOnPress}
      testID="locationWhenInUsePermission"
    />
  );
};
