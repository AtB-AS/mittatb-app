import {useEffect, useState} from 'react';
import {getBenefits} from './api/api';
import {OperatorBenefitsType} from './types';

export const useBenefits = (operatorId: string | undefined) => {
  const [benefits, setBenefits] = useState<OperatorBenefitsType | undefined>();

  useEffect(() => {
    if (operatorId) {
      getBenefits()
        .then((benefits) => benefits.find((b) => b.operator === operatorId))
        .then(setBenefits);
    }
  }, [operatorId]);

  return benefits;
};
