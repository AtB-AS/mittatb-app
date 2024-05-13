import {useUserBenefitsQuery} from '@atb/mobility/queries/use-user-benefits-query';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {isDefined} from '@atb/utils/presence';

const benefitIdsRequiringValueCode: OperatorBenefitType['id'][] = [
  'single-unlock',
  'free-unlock',
];

export const useIsEligibleForBenefit = (
  operatorBenefit?: OperatorBenefitType,
) => {
  const {
    data: userBenefits,
    isInitialLoading: isLoading,
    isError,
  } = useUserBenefitsQuery(!!operatorBenefit);

  const userBenefitIds =
    userBenefits?.flatMap((b) => b.benefitIds).filter(isDefined) || [];

  const isUserEligibleForBenefit =
    operatorBenefit && userBenefitIds.includes(operatorBenefit.id);

  const benefitRequiresValueCodeToUnlock =
    operatorBenefit &&
    benefitIdsRequiringValueCode.includes(operatorBenefit.id);

  return {
    isLoading,
    isError,
    isUserEligibleForBenefit: !!isUserEligibleForBenefit,
    benefitRequiresValueCodeToUnlock: !!benefitRequiresValueCodeToUnlock,
  };
};
