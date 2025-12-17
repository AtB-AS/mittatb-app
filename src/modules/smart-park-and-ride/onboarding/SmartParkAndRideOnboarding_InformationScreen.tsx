import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import React from 'react';
import {
  OnboardingCarouselScreenProps,
  OnboardingScreenComponent,
} from '@atb/modules/onboarding';
import {ThemedCarValidTicket} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useOnboardingCarouselNavigation} from '@atb/modules/onboarding';
import {sparOnboardingId} from './config';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

export type InformationScreenProps =
  OnboardingCarouselScreenProps<'SmartParkAndRideOnboarding_InformationScreen'>;

export const SmartParkAndRideOnboarding_InformationScreen = ({
  navigation,
}: InformationScreenProps) => {
  const focusRef = useFocusOnLoad(navigation);
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  const {navigateToNextScreen, closeOnboardingCarousel} =
    useOnboardingCarouselNavigation(
      sparOnboardingId,
      'SmartParkAndRideOnboarding_InformationScreen',
    );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedCarValidTicket height={170} />}
      headerProps={{
        rightButton: {
          type: 'close',
          onPress: closeOnboardingCarousel,
        },
      }}
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
      focusRef={focusRef}
    />
  );
};
