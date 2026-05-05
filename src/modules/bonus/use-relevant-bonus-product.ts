import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useIsBonusActiveForUser} from './use-is-bonus-active-for-user';
import {useActiveBonusProductsQuery} from './queries';

export const useRelevantBonusProduct = (
  operatorId: string | undefined,
  formFactor: FormFactor,
) => {
  const isBonusActiveForUser = useIsBonusActiveForUser();
  const {data: activeBonusProducts} = useActiveBonusProductsQuery(
    Boolean(operatorId) && isBonusActiveForUser,
  );
  if (!operatorId) return undefined;
  return activeBonusProducts?.find(
    (bonusProduct) =>
      bonusProduct.formFactors.includes(formFactor) &&
      bonusProduct.operatorIds.includes(operatorId),
  );
};
