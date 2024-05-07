import {useUserBenefitsQuery} from '@atb/mobility/queries/use-user-benefits-query';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';

export const useIsEligibleForBenefit = (
  operatorBenefit: OperatorBenefitType | undefined,
) => {
  const {
    data: userBenefits,
    isInitialLoading: isLoading,
    isError,
  } = useUserBenefitsQuery(!!operatorBenefit);

  const userBenefitIds = userBenefits?.flatMap((b) => b.benefitIds) || [];
  const commonBenefitIds = userBenefitIds.filter(
    (userBenefitId) => userBenefitId === operatorBenefit?.id,
  );

  const isUserEligibleForBenefit = commonBenefitIds.length > 0;

  const benefitIdsThatRequireValueCode: OperatorBenefitType['id'][] = [
    'single-unlock',
    'free-unlock',
  ];

  const benefitRequiresValueCodeToUnlock = benefitIdsThatRequireValueCode.some(
    (benefitIdThatRequiresValueCode) =>
      commonBenefitIds.includes(benefitIdThatRequiresValueCode),
  );

  return {
    isLoading,
    isError,
    isUserEligibleForBenefit,
    benefitRequiresValueCodeToUnlock,
  };
};
