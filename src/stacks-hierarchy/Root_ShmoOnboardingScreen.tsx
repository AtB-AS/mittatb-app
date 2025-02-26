import React, {useEffect} from 'react';
import {RulesBlocker} from '@atb/mobility/components/onboarding/RulesBlocker';
import {LocationBlocker} from '@atb/mobility/components/onboarding/LocationBlocker';
import {PaymentBlocker} from '@atb/mobility/components/onboarding/PaymentBlocker';
import {ShmoRequirementEnum} from '@atb/mobility/types';
import {useShmoRequirements} from '@atb/mobility/use-shmo-requirements';
import {useNavigation} from '@react-navigation/native';

export type ShmoOnboardingProps = {};

export const Root_ShmoOnboardingScreen = ({}: ShmoOnboardingProps) => {
  const {requirements, hasBlockers} = useShmoRequirements();

  const navigation = useNavigation();

  useEffect(() => {
    if (!hasBlockers) {
      navigation.goBack();
    }
  }, [hasBlockers]);

  if (
    requirements.find(
      (e) => e.requirementCode === ShmoRequirementEnum.TERMS_AND_CONDITIONS,
    )?.isBlocking
  ) {
    return <RulesBlocker />;
  }

  if (
    requirements.find((e) => e.requirementCode === ShmoRequirementEnum.LOCATION)
      ?.isBlocking
  ) {
    return <LocationBlocker />;
  }

  if (
    requirements.find(
      (e) => e.requirementCode === ShmoRequirementEnum.PAYMENT_CARD,
    )?.isBlocking
  ) {
    return <PaymentBlocker />;
  }

  return null;
};
