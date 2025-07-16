import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import React from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedParkAndRide} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useNavigation} from '@react-navigation/native';
import {ThemeText} from '@atb/components/text';

export const SmartParkAndRideOnboarding_InformationScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();

  const navigateToNext = () => {
    navigation.navigate(
      'SmartParkAndRideOnboarding_AutomaticRegistrationScreen',
    );
  };

  return (
    <OnboardingScreenComponent
      illustration={<ThemedParkAndRide height={170} />}
      title={t(SmartParkAndRideTexts.onboarding.information.title)}
      description={t(SmartParkAndRideTexts.onboarding.information.description)}
      contentNode={<PenaltyNoticeText />}
      footerButton={{
        onPress: navigateToNext,
        text: t(SmartParkAndRideTexts.onboarding.information.buttonText),
        expanded: true,
        rightIcon: {svg: ArrowRight},
      }}
      testID="welcomeSmartParkAndRideOnboarding"
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
