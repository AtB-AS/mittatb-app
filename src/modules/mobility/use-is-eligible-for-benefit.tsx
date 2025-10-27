import {useUserBenefitsQuery} from './queries/use-user-benefits-query';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility';
import {isDefined} from '@atb/utils/presence';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';

export const useIsEligibleForBenefit = (
  operatorBenefit?: OperatorBenefitType,
) => {
  const {benefitIdsRequiringValueCode} = useFirestoreConfigurationContext();
  const {
    data: userBenefits,
    isInitialLoading: isLoading,
    isError,
  } = useUserBenefitsQuery(!!operatorBenefit);

  const userBenefitTypes =
    userBenefits?.flatMap((b) => b.benefitTypes).filter(isDefined) || [];

  const isUserEligibleForBenefit =
    operatorBenefit && userBenefitTypes.includes(operatorBenefit.id);

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
