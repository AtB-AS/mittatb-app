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
import {MapStateActionType, useMapContext} from '@atb/modules/map';

type Props = RootStackScreenProps<'Root_ShmoOnboardingScreen'>;

export const Root_ShmoOnboardingScreen = ({navigation, route}: Props) => {
  const {requirements, hasBlockers, setGivenConsent} = useShmoRequirements();
  const {dispatchMapState} = useMapContext();

  useEffect(() => {
    if (!hasBlockers) {
      dispatchMapState({
        type: MapStateActionType.ScooterScanned,
        assetId: route.params.assetId,
      });
      navigation.goBack();
    }
  }, [dispatchMapState, hasBlockers, navigation, route.params.assetId]);

  if (
    requirements.find(
      (e) => e.requirementCode === ShmoRequirementEnum.AGE_VERIFICATION,
    )?.isBlocking
  ) {
    return <AgeVerificationScreenComponent />;
  }

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
