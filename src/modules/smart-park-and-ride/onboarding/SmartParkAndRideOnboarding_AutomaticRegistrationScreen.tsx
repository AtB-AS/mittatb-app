import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import React from 'react';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedCityBike} from '@atb/theme/ThemedAssets';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {useSmartParkAndRideOnboarding} from './SmartParkAndRideOnboardingContext';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {Linking} from 'react-native';

export const SmartParkAndRideOnboarding_AutomaticRegistrationScreen = () => {
  const {t} = useTranslation();
  const {completeOnboarding} = useSmartParkAndRideOnboarding();
  const navigation = useNavigation<RootNavigationProps>();

  const handleComplete = () => {
    completeOnboarding();
    navigation.navigate('Root_SmartParkAndRideAddScreen', {
      hideHeader: true,
    });
  };

  return (
    <OnboardingScreenComponent
      illustration={<ThemedCityBike height={170} />}
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
        onPress: handleComplete,
        text: t(
          SmartParkAndRideTexts.onboarding.automaticRegistration.buttonText,
        ),
        expanded: true,
        rightIcon: {svg: Confirm},
      }}
      testID="benefitsSmartParkAndRideOnboarding"
    />
  );
};
