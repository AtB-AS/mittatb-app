import {Button} from '@atb/components/button';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React, {useEffect, useState} from 'react';
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {OperatorBenefitId} from '@atb/mobility/types';
import {useOperators} from '@atb/mobility/use-operators';
import {Linking} from 'react-native';
import {getValueCode} from '@atb/mobility/api/api';

type Props = {
  appStoreUri: string | undefined;
  operatorId: string | undefined;
  operatorName: string;
  rentalAppUri: string | undefined;
  userBenefits: OperatorBenefitId[];
};
export const CallToActionButton = ({
  appStoreUri,
  operatorName,
  operatorId,
  rentalAppUri,
  userBenefits,
}: Props) => {
  const {t, language} = useTranslation();
  const operators = useOperators();
  const operator = operators.byId(operatorId);
  const operatorBenefit =
    operator?.benefits.length === 1 ? operator.benefits[0] : undefined;
  const callToAction = operatorBenefit?.callToAction;
  const [valueCode, setValueCode] = useState<string>();

  const {openOperatorApp} = useOperatorApp({
    operatorName,
    appStoreUri,
    rentalAppUri,
  });

  const userHasBenefit =
    operatorBenefit && userBenefits.includes(operatorBenefit.id);

  useEffect(() => {
    if (operatorId && userHasBenefit) {
      getValueCode(operatorId).then(setValueCode);
    }
  }, [operatorId, userHasBenefit]);

  const callToActionText =
    callToAction?.name && userHasBenefit
      ? getTextForLanguage(callToAction.name, language) ??
        t(MobilityTexts.operatorAppSwitchButton(operatorName))
      : t(MobilityTexts.operatorAppSwitchButton(operatorName));

  const onCallToAction = () =>
    callToAction?.url && userHasBenefit
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
