import {getTextForLanguage, useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import React from 'react';
import {
  OnboardingScreenComponent,
  useOnboardingCarouselNavigation,
} from '@atb/modules/onboarding';
import {ThemedCarRegister} from '@atb/theme/ThemedAssets';

import {Linking} from 'react-native';
import {sparOnboardingId} from './config';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';

export const SmartParkAndRideOnboarding_AutomaticRegistrationScreen = () => {
  const {t, language} = useTranslation();
  const analytics = useAnalyticsContext();
  const {configurableLinks} = useFirestoreConfigurationContext();

  const {
    navigateToNextScreen,
    navigateToPreviousScreen,
    closeOnboardingCarousel,
  } = useOnboardingCarouselNavigation(
    sparOnboardingId,
    'SmartParkAndRideOnboarding_AutomaticRegistrationScreen',
  );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedCarRegister height={170} />}
      headerProps={{
        leftButton: {
          type: 'back',
          withIcon: true,
          onPress: navigateToPreviousScreen,
        },
        rightButton: {
          type: 'close',
          withIcon: true,
          onPress: () => closeOnboardingCarousel('smartParkAndRide'),
        },
      }}
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
          analytics.logEvent(
            'Smart Park & Ride',
            'Onboarding external link clicked',
          );
          const externalLink = getTextForLanguage(
            configurableLinks?.sparReadMoreUrl,
            language,
          );
          externalLink && Linking.openURL(externalLink);
        },
      }}
      footerButton={{
        onPress: () => {
          analytics.logEvent(
            'Smart Park & Ride',
            'Onboarding automatic registration continue clicked',
          );
          navigateToNextScreen();
        },
        text: t(
          SmartParkAndRideTexts.onboarding.automaticRegistration.buttonText,
        ),
        expanded: true,
        rightIcon: {svg: ArrowRight},
      }}
      testID="smartParkAndRideOnboardingAutomaticRegistration"
    />
  );
};
