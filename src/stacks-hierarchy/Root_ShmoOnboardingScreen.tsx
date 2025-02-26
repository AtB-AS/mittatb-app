import React, {useEffect} from 'react';
import {RulesBlocker} from '@atb/mobility/components/onboarding/RulesBlocker';
import {LocationBlocker} from '@atb/mobility/components/onboarding/LocationBlocker';
import {PaymentBlocker} from '@atb/mobility/components/onboarding/PaymentBlocker';
import {ShmoRequirementEnum} from '@atb/mobility/types';
import {useShmoRequirements} from '@atb/mobility/use-shmo-requirements';
import {RootStackScreenProps} from './navigation-types';

type Props = RootStackScreenProps<'Root_ShmoOnboardingScreen'>;

export const Root_ShmoOnboardingScreen = ({navigation}: Props) => {
  const {requirements, hasBlockers} = useShmoRequirements();

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
