import {useUserBenefitsQuery} from '@atb/mobility/queries/use-user-benefits-query';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {isDefined} from '@atb/utils/presence';
import {useFirestoreConfiguration} from '@atb/configuration';

export const useIsEligibleForBenefit = (
  operatorBenefit?: OperatorBenefitType,
) => {
  const {benefitIdsRequiringValueCode} = useFirestoreConfiguration();
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
    benefitIdsRequiringValueCode?.includes(operatorBenefit.id);

  return {
    isLoading,
    isError,
    isUserEligibleForBenefit: !!isUserEligibleForBenefit,
    benefitRequiresValueCodeToUnlock: !!benefitRequiresValueCodeToUnlock,
  };
};
