import React, {useEffect} from 'react';
import {
  AgeVerificationScreenComponent,
  RulesScreenComponent,
} from '@atb/modules/mobility';
import {LocationScreenComponent} from '@atb/modules/mobility';
import {PaymentScreenComponent} from '@atb/modules/mobility';
import {ShmoRequirementEnum} from '@atb/modules/mobility';
import {useShmoRequirements} from '@atb/modules/mobility';
import {RootStackScreenProps} from './navigation-types';
import {useMapContext} from '@atb/modules/map';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = RootStackScreenProps<'Root_ShmoOnboardingScreen'>;

export const Root_ShmoOnboardingScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
  const {requirements, hasBlockers} = useShmoRequirements();
  const {setGivenShmoConsent} = useMapContext();

  useEffect(() => {
    if (!hasBlockers) {
      navigation.goBack();
    }
  }, [hasBlockers, navigation]);

  if (
    requirements.find(
      (e) => e.requirementCode === ShmoRequirementEnum.AGE_VERIFICATION,
    )?.isBlocking
  ) {
    return <AgeVerificationScreenComponent focusRef={focusRef} />;
  }

  if (
    requirements.find(
      (e) => e.requirementCode === ShmoRequirementEnum.TERMS_AND_CONDITIONS,
    )?.isBlocking
  ) {
    return (
      <RulesScreenComponent
        onGiveConsent={setGivenShmoConsent}
        focusRef={focusRef}
      />
    );
  }

  if (
    requirements.find((e) => e.requirementCode === ShmoRequirementEnum.LOCATION)
      ?.isBlocking
  ) {
    return <LocationScreenComponent focusRef={focusRef} />;
  }

  if (
    requirements.find(
      (e) => e.requirementCode === ShmoRequirementEnum.PAYMENT_CARD,
    )?.isBlocking
  ) {
    return <PaymentScreenComponent focusRef={focusRef} />;
  }

  return null;
};
