import {useUserBenefitsQuery} from '@atb/mobility/queries/use-user-benefits-query';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';

export const useIsEligibleForBenefit = (
  operatorBenefit: OperatorBenefitType | undefined,
) => {
  const {
    data: userBenefits,
    isLoading,
    isError,
  } = useUserBenefitsQuery(!!operatorBenefit);

  const isUserEligibleForBenefit =
    userBenefits && operatorBenefit?.id
      ? userBenefits.flatMap((b) => b.benefitIds).includes(operatorBenefit.id)
      : false;

  return {
    isLoading,
    isError,
    isUserEligibleForBenefit,
  };
};
