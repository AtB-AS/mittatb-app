import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import React from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedCarRegister} from '@atb/theme/ThemedAssets';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';

import {Linking} from 'react-native';
import {sparPilotEnrollmentId} from './config';
import {useNavigateToNextEnrollmentOnboardingScreen} from '@atb/modules/enrollment-onboarding';

export const SmartParkAndRideOnboarding_AutomaticRegistrationScreen = () => {
  const {t} = useTranslation();

  const navigateToNextScreen = useNavigateToNextEnrollmentOnboardingScreen(
    sparPilotEnrollmentId,
    'SmartParkAndRideOnboarding_AutomaticRegistrationScreen',
  );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedCarRegister height={170} />}
      title={t(SmartParkAndRideTexts.onboarding.automaticRegistration.title)}
      description={t(
        SmartParkAndRideTexts.onboarding.automaticRegistration.description,
      )}
      descriptionLink={{
        text: t(
          SmartParkAndRideTexts.onboarding.automaticRegistration.descriptionLink
            .text,
        ),
        a11yHint: t(
          SmartParkAndRideTexts.onboarding.automaticRegistration.descriptionLink
            .a11yHint,
        ),
        onPress: () => {
          Linking.openURL('https://www.atb.no/RanheimFabrikker'); // TODO: This link should be configurable, and updated.
        },
      }}
      footerButton={{
        onPress: navigateToNextScreen,
        text: t(
          SmartParkAndRideTexts.onboarding.automaticRegistration.buttonText,
        ),
        expanded: true,
        rightIcon: {svg: Confirm},
      }}
      testID="smartParkAndRideOnboardingAutomaticRegistration"
    />
  );
};
