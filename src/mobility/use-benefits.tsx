import {useEffect, useState} from 'react';
import {getBenefits, getValueCode} from './api/api';
import {useOperators} from '@atb/mobility/use-operators';
import {OperatorBenefitIdType, OperatorBenefitType} from '@atb/configuration';
import {Linking} from 'react-native';

export const useBenefits = (operatorId: string | undefined) => {
  const operators = useOperators();
  const [userBenefits, setUserBenefits] = useState<OperatorBenefitIdType[]>([]);
  const [valueCode, setValueCode] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (operatorId) {
      setLoading(true);
      Promise.all([
        getBenefits()
          .then((userBenefits) =>
            userBenefits.find((b) => b.operator === operatorId),
          )
          .then((userBenefitsForOperator) =>
            setUserBenefits(userBenefitsForOperator?.benefitIds ?? []),
          ),
        getValueCode(operatorId).then(setValueCode),
      ])
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [operatorId]);

  const doBenefitAction = (benefit: OperatorBenefitType) => {
    return Linking.openURL(
      insertValueCode(benefit.callToAction.url, valueCode),
    );
  };

  return {
    userBenefits,
    operatorBenefits: operators.byId(operatorId)?.benefits ?? [],
    doBenefitAction,
    loading,
    error,
  };
};

const insertValueCode = (url: string, valueCode: string | undefined) => {
  if (!valueCode) return url;
  return url.replace(/\{(.*?)}/g, valueCode);
};
