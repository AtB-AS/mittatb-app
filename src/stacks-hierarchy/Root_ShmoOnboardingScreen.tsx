import React, {useEffect} from 'react';
import {RulesScreenComponent} from '@atb/modules/mobility';
import {LocationScreenComponent} from '@atb/modules/mobility';
import {PaymentScreenComponent} from '@atb/modules/mobility';
import {ShmoRequirementEnum} from '@atb/modules/mobility';
import {useShmoRequirements} from '@atb/modules/mobility';
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
