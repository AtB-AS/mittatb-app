import {useEffect, useState} from 'react';
import {useOperators} from '@atb/mobility/use-operators';
import {OperatorBenefitIdType} from '@atb/configuration';
import {useUserBenefitsQuery} from '@atb/mobility/use-user-benefits-query';

export const useBenefits = (operatorId: string | undefined) => {
  const operators = useOperators();
  const {data: allUserBenefits, error, isLoading} = useUserBenefitsQuery();
  const [userBenefitsForOperator, setUserBenefitsForOperator] = useState<
    OperatorBenefitIdType[]
  >([]);

  useEffect(() => {
    if (allUserBenefits) {
      setUserBenefitsForOperator(
        allUserBenefits.find((b) => b.operator === operatorId)?.benefitIds ??
          [],
      );
    }
  }, [allUserBenefits]);

  return {
    userBenefits: userBenefitsForOperator,
    operatorBenefits: operators.byId(operatorId)?.benefits ?? [],
    isLoading,
    error,
  };
};
