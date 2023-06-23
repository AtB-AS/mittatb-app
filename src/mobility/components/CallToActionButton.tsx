import {Button} from '@atb/components/button';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React, {useEffect, useState} from 'react';
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {Linking} from 'react-native';
import {getValueCode} from '@atb/mobility/api/api';
import {
  OperatorBenefitIdType,
  OperatorBenefitType,
} from '@atb-as/config-specs/lib/mobility-operators';
import {getBenefit, isUserEligibleForBenefit} from '@atb/mobility/utils';

type Props = {
  appStoreUri: string | undefined;
  operatorId: string | undefined;
  operatorName: string;
  rentalAppUri: string | undefined;
  userBenefits: OperatorBenefitIdType[];
  operatorBenefits: OperatorBenefitType[];
};
export const CallToActionButton = ({
  appStoreUri,
  operatorName,
  operatorId,
  rentalAppUri,
  userBenefits,
  operatorBenefits,
}: Props) => {
  const {t, language} = useTranslation();
  const [valueCode, setValueCode] = useState<string>();

  const {openOperatorApp} = useOperatorApp({
    operatorName,
    appStoreUri,
    rentalAppUri,
  });

  const isEligibleForBenefit = isUserEligibleForBenefit(
    'free-unlock',
    userBenefits,
  );

  const callToAction = getBenefit(
    'free-unlock',
    operatorBenefits,
  )?.callToAction;

  useEffect(() => {
    if (operatorId && isEligibleForBenefit) {
      getValueCode(operatorId).then(setValueCode);
    }
  }, [operatorId, isEligibleForBenefit]);

  const callToActionText =
    callToAction?.name && isEligibleForBenefit
      ? getTextForLanguage(callToAction.name, language) ??
        t(MobilityTexts.operatorAppSwitchButton(operatorName))
      : t(MobilityTexts.operatorAppSwitchButton(operatorName));

  const onCallToAction = () =>
    callToAction?.url && isEligibleForBenefit
      ? Linking.openURL(insertValueCode(callToAction.url, valueCode))
      : openOperatorApp();

  return (
    <Button
      text={callToActionText}
      onPress={onCallToAction}
      mode="primary"
      interactiveColor={'interactive_0'}
    />
  );
};

const insertValueCode = (url: string, valueCode: string | undefined) => {
  if (!valueCode) return url;
  return url.replace(/\{(.*?)}/g, valueCode);
};
