import {getTextForLanguage, useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import React from 'react';
import {
  OnboardingCarouselScreenProps,
  OnboardingScreenComponent,
  useOnboardingCarouselNavigation,
} from '@atb/modules/onboarding';
import {ThemedCarRegister} from '@atb/theme/ThemedAssets';
import {sparOnboardingId} from './config';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {openInAppBrowser} from '@atb/modules/in-app-browser';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

export type AutomaticRegistrationScreenProps =
  OnboardingCarouselScreenProps<'SmartParkAndRideOnboarding_AutomaticRegistrationScreen'>;

export const SmartParkAndRideOnboarding_AutomaticRegistrationScreen = ({
  navigation,
}: AutomaticRegistrationScreenProps) => {
  const focusRef = useFocusOnLoad(navigation);
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
          onPress: navigateToPreviousScreen,
        },
        rightButton: {
          type: 'close',
          onPress: closeOnboardingCarousel,
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
          externalLink && openInAppBrowser(externalLink, 'close');
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
      focusRef={focusRef}
    />
  );
};
