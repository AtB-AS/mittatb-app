import {useOperators} from '@atb/mobility/use-operators';
import {useUserBenefitsQuery} from '@atb/mobility/use-user-benefits-query';

export const useOperatorBenefit = (operatorId: string | undefined) => {
  const operators = useOperators();
  const {data: userBenefits, isError, isLoading} = useUserBenefitsQuery();

  // The data model supports multiple benefits per operator.
  // Currently, there is no requirement for more than one benefit per operator,
  // and the current UI is designed for only one.
  const operatorBenefit = operators.byId(operatorId)?.benefits[0];
  const isUserEligibleForBenefit =
    userBenefits && operatorBenefit?.id
      ? userBenefits.flatMap((b) => b.benefitIds).includes(operatorBenefit.id)
      : false;

  return {
    isLoading,
    isError,
    operatorBenefit,
    isUserEligibleForBenefit,
  };
};
