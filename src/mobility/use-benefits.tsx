import {useEffect, useState} from 'react';
import {getBenefits} from './api/api';
import {useOperators} from '@atb/mobility/use-operators';
import {OperatorBenefitIdType} from '@atb-as/config-specs/lib/mobility-operators';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {getBenefit, isUserEligibleForBenefit} from '@atb/mobility/utils';

export const useBenefits = (operatorId: string | undefined) => {
  const {t, language} = useTranslation();
  const operators = useOperators();
  const [userBenefits, setUserBenefits] = useState<OperatorBenefitIdType[]>([]);

  useEffect(() => {
    if (operatorId) {
      getBenefits()
        .then((benefits) => benefits.find((b) => b.operator === operatorId))
        .then((benefits) => setUserBenefits(benefits?.benefits ?? []));
    }
  }, [operatorId]);

  const getOperatorBenefits = () => operators.byId(operatorId)?.benefits ?? [];
  const getCallToAction = (benefit: OperatorBenefitIdType) =>
    getBenefit(benefit, getOperatorBenefits())?.callToAction;

  const callToAction = (
    benefit: OperatorBenefitIdType,
    operatorName: string,
  ): {text: string; url?: string} => {
    const callToAction = getCallToAction(benefit);
    let text = t(MobilityTexts.operatorAppSwitchButton(operatorName)),
      url;
    if (
      isUserEligibleForBenefit(benefit, userBenefits) &&
      callToAction?.name &&
      callToAction?.url
    ) {
      text =
        getTextForLanguage(getCallToAction(benefit)?.name, language) ??
        t(MobilityTexts.operatorAppSwitchButton(operatorName));
      url = callToAction.url;
    }
    return {text, url};
  };

  return {
    userBenefits,
    operatorBenefits: getOperatorBenefits(),
    callToAction,
  };
};
