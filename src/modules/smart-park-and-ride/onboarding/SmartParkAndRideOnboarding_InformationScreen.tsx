import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import React from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedCarValidTicket} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import {useNavigateToNextOnboardingCarouselScreen} from '@atb/modules/onboarding';
import {sparOnboardingId} from './config';
import {useAnalyticsContext} from '@atb/modules/analytics';

export const SmartParkAndRideOnboarding_InformationScreen = () => {
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  const navigateToNextScreen = useNavigateToNextOnboardingCarouselScreen(
    sparOnboardingId,
    'SmartParkAndRideOnboarding_InformationScreen',
  );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedCarValidTicket height={170} />}
      title={t(SmartParkAndRideTexts.onboarding.information.title)}
      description={t(SmartParkAndRideTexts.onboarding.information.description)}
      footerButton={{
        onPress: () => {
          analytics.logEvent(
            'Smart Park & Ride',
            'Onboarding information continue clicked',
          );
          navigateToNextScreen();
        },
        text: t(SmartParkAndRideTexts.onboarding.information.buttonText),
        expanded: true,
        rightIcon: {svg: ArrowRight},
      }}
      testID="smartParkAndRideOnboardingInformation"
    />
  );
};
