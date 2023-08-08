import {useEffect, useState} from 'react';
import {getBenefits} from './api/api';
import {useOperators} from '@atb/mobility/use-operators';
import {OperatorBenefitIdType} from '@atb-as/config-specs/lib/mobility-operators';

export const useBenefits = (operatorId: string | undefined) => {
  const operators = useOperators();
  const [userBenefits, setUserBenefits] = useState<OperatorBenefitIdType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (operatorId) {
      setLoading(true);
      getBenefits()
        .then((benefits) => benefits.find((b) => b.operator === operatorId))
        .then((benefits) => setUserBenefits(benefits?.benefits ?? []))
        .then(() => setLoading(false))
        .catch(setError);
    }
  }, [operatorId]);

  return {
    userBenefits,
    operatorBenefits: operators.byId(operatorId)?.benefits ?? [],
    loading,
    error,
  };
};
