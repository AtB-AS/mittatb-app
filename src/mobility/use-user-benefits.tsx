import {useEffect, useState} from 'react';
import {getBenefits} from './api/api';
import {OperatorBenefitId} from './types';

export const useUserBenefits = (operatorId: string | undefined) => {
  const [userBenefits, setUserBenefits] = useState<OperatorBenefitId[]>([]);

  useEffect(() => {
    if (operatorId) {
      getBenefits()
        .then((benefits) => benefits.find((b) => b.operator === operatorId))
        .then((benefits) => setUserBenefits(benefits?.benefits ?? []));
    }
  }, [operatorId]);

  return userBenefits;
};
