import {useUserBenefitsQuery} from '@atb/mobility/queries/use-user-benefits-query';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {isDefined} from '@atb/utils/presence';

const benefitIdsRequiringValueCode: OperatorBenefitType['id'][] = [
  'single-unlock',
  'free-unlock',
];

export const useIsEligibleForBenefit = (
  operatorBenefit: OperatorBenefitType | undefined,
) => {
  const {
    data: userBenefits,
    isInitialLoading: isLoading,
    isError,
  } = useUserBenefitsQuery(!!operatorBenefit);
  const res = {
    isLoading,
    isError,
    isUserEligibleForBenefit: false,
    benefitRequiresValueCodeToUnlock: false,
  };
  if (!operatorBenefit) return res;

  const userBenefitIds =
    userBenefits?.flatMap((b) => b.benefitIds).filter(isDefined) || [];

  const isUserEligibleForBenefit = userBenefitIds.includes(operatorBenefit.id);

  const benefitRequiresValueCodeToUnlock =
    benefitIdsRequiringValueCode.includes(operatorBenefit.id);

  return {
    ...res,
    isUserEligibleForBenefit,
    benefitRequiresValueCodeToUnlock,
  };
};
