import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import React from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedCarValidTicket} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import {useNavigateToNextOnboardingCarouselScreen} from '@atb/modules/onboarding';
import {sparPilotEnrollmentId} from './config';

export const SmartParkAndRideOnboarding_InformationScreen = () => {
  const {t} = useTranslation();

  const navigateToNextScreen = useNavigateToNextOnboardingCarouselScreen(
    sparPilotEnrollmentId,
    'SmartParkAndRideOnboarding_InformationScreen',
  );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedCarValidTicket height={170} />}
      title={t(SmartParkAndRideTexts.onboarding.information.title)}
      description={t(SmartParkAndRideTexts.onboarding.information.description)}
      contentNode={<PenaltyNoticeText />}
      footerButton={{
        onPress: navigateToNextScreen,
        text: t(SmartParkAndRideTexts.onboarding.information.buttonText),
        expanded: true,
        rightIcon: {svg: ArrowRight},
      }}
      testID="smartParkAndRideOnboardingInformation"
    />
  );
};

const PenaltyNoticeText = () => {
  const {t} = useTranslation();
  return (
    <ThemeText typography="body__primary--bold" style={{textAlign: 'center'}}>
      {t(SmartParkAndRideTexts.onboarding.information.penaltyNotice)}
    </ThemeText>
  );
};
