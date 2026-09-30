import React, {useEffect} from 'react';
import {
  AgeVerificationScreenComponent,
  RulesScreenComponent,
} from '@atb/modules/mobility';
import {LocationScreenComponent} from '@atb/modules/mobility';
import {PaymentScreenComponent} from '@atb/modules/mobility';
import {useShmoRequirements} from '@atb/modules/mobility';
import {RootStackScreenProps} from './navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {PreReqType} from '@atb/api/types/mobility';

type Props = RootStackScreenProps<'Root_ShmoOnboardingScreen'>;

export const Root_ShmoOnboardingScreen = ({navigation, route}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
  const formFactor = route.params?.formFactor;
  const preReqs = route.params?.preReqs;
  const {requirements, hasBlockers} = useShmoRequirements(preReqs, formFactor);

  useEffect(() => {
    if (!hasBlockers) {
      navigation.goBack();
    }
  }, [hasBlockers, navigation]);

  // preReqs are sent in the order they should be presented/resolved in.
  // IS_LOGGED_IN is excluded here as it's already resolved earlier, in ShmoActionButton.
  const blockingRequirementCode = requirements.find(
    (r) => r.isBlocking && r.requirementCode !== PreReqType.IS_LOGGED_IN,
  )?.requirementCode;

  switch (blockingRequirementCode) {
    case PreReqType.AGE_VERIFICATION:
      return <AgeVerificationScreenComponent focusRef={focusRef} />;
    case PreReqType.TERMS_AND_CONDITIONS:
      return (
        <RulesScreenComponent focusRef={focusRef} formFactor={formFactor} />
      );
    case PreReqType.PRECISE_LOCATION:
      return <LocationScreenComponent focusRef={focusRef} />;
    case PreReqType.PAYMENT_METHOD:
      return <PaymentScreenComponent focusRef={focusRef} />;
    default:
      return null;
  }
};
