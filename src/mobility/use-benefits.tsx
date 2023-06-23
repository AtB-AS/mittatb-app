import {useEffect, useState} from 'react';
import {getBenefits} from './api/api';
import {useOperators} from '@atb/mobility/use-operators';
import {OperatorBenefitIdType} from '@atb-as/config-specs/lib/mobility-operators';

export const useBenefits = (operatorId: string | undefined) => {
  const operators = useOperators();
  const [userBenefits, setUserBenefits] = useState<OperatorBenefitIdType[]>([]);

  useEffect(() => {
    if (operatorId) {
      getBenefits()
        .then((benefits) => benefits.find((b) => b.operator === operatorId))
        .then((benefits) => setUserBenefits(benefits?.benefits ?? []));
    }
  }, [operatorId]);

  return {
    userBenefits,
    operatorBenefits: operators.byId(operatorId)?.benefits ?? [],
  };
};
