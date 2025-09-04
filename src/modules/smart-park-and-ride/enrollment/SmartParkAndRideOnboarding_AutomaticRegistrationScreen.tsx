import React from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedCityBike} from '@atb/theme/ThemedAssets';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';

import {Linking} from 'react-native';
import {sparPilotEnrollmentId} from './config';
import {useNavigateToNextEnrollmentOnboardingScreen} from '@atb/modules/enrollment-onboarding';
import {useSmartParkAndRideOnboardingTexts} from './useSmartParkAndRideOnboardingTexts';

export const SmartParkAndRideOnboarding_AutomaticRegistrationScreen = () => {
  const onboardingTexts = useSmartParkAndRideOnboardingTexts();

  const navigateToNextScreen = useNavigateToNextEnrollmentOnboardingScreen(
    sparPilotEnrollmentId,
    'SmartParkAndRideOnboarding_AutomaticRegistrationScreen',
  );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedCityBike height={170} />}
      title={onboardingTexts.automaticRegistration.title}
      description={onboardingTexts.automaticRegistration.description}
      descriptionLink={{
        text: onboardingTexts.automaticRegistration.descriptionLinkText,
        a11yHint: onboardingTexts.automaticRegistration.descriptionLinkText,
        onPress: () => {
          Linking.openURL(
            onboardingTexts.automaticRegistration.descriptionLinkUrl,
          );
        },
      }}
      footerButton={{
        onPress: navigateToNextScreen,
        text: onboardingTexts.automaticRegistration.buttonText,
        expanded: true,
        rightIcon: {svg: Confirm},
      }}
      testID="smartParkAndRideOnboardingAutomaticRegistration"
    />
  );
};
