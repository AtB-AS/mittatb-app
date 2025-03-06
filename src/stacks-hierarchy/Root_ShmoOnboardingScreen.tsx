import React, {useEffect} from 'react';
import {RulesScreenComponent} from '@atb/mobility/components/onboarding/RulesScreenComponent';
import {LocationScreenComponent} from '@atb/mobility/components/onboarding/LocationScreenComponent';
import {PaymentScreenComponent} from '@atb/mobility/components/onboarding/PaymentScreenComponent';
import {ShmoRequirementEnum} from '@atb/mobility/types';
import {useShmoRequirements} from '@atb/mobility/use-shmo-requirements';
import {RootStackScreenProps} from './navigation-types';

type Props = RootStackScreenProps<'Root_ShmoOnboardingScreen'>;

export const Root_ShmoOnboardingScreen = ({navigation}: Props) => {
  const {requirements, hasBlockers, setGivenConsent} = useShmoRequirements();

  useEffect(() => {
    if (!hasBlockers) {
      navigation.goBack();
    }
  }, [hasBlockers, navigation]);

  if (
    requirements.find(
      (e) => e.requirementCode === ShmoRequirementEnum.TERMS_AND_CONDITIONS,
    )?.isBlocking
  ) {
    return <RulesScreenComponent onGiveConsent={setGivenConsent} />;
  }

  if (
    requirements.find((e) => e.requirementCode === ShmoRequirementEnum.LOCATION)
      ?.isBlocking
  ) {
    return <LocationScreenComponent />;
  }

  if (
    requirements.find(
      (e) => e.requirementCode === ShmoRequirementEnum.PAYMENT_CARD,
    )?.isBlocking
  ) {
    return <PaymentScreenComponent />;
  }

  return null;
};
