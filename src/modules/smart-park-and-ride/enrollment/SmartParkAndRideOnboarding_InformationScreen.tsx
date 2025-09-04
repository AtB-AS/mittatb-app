import React from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedParkAndRide} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import {useNavigateToNextEnrollmentOnboardingScreen} from '@atb/modules/enrollment-onboarding';
import {sparPilotEnrollmentId} from './config';
import {useSmartParkAndRideOnboardingTexts} from './useSmartParkAndRideOnboardingTexts';

export const SmartParkAndRideOnboarding_InformationScreen = () => {
  const onboardingTexts = useSmartParkAndRideOnboardingTexts();

  const navigateToNextScreen = useNavigateToNextEnrollmentOnboardingScreen(
    sparPilotEnrollmentId,
    'SmartParkAndRideOnboarding_InformationScreen',
  );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedParkAndRide height={170} />}
      title={onboardingTexts.information.title}
      description={onboardingTexts.information.description}
      contentNode={
        <PenaltyNoticeText text={onboardingTexts.information.penaltyNotice} />
      }
      footerButton={{
        onPress: navigateToNextScreen,
        text: onboardingTexts.information.buttonText,
        expanded: true,
        rightIcon: {svg: ArrowRight},
      }}
      testID="smartParkAndRideOnboardingInformation"
    />
  );
};

const PenaltyNoticeText = ({text}: {text: string}) => {
  return (
    <ThemeText typography="body__primary--bold" style={{textAlign: 'center'}}>
      {text}
    </ThemeText>
  );
};
