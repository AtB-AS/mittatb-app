import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useActiveBonusProductsQuery} from './queries';

export const useRelevantBonusProduct = (
  operatorId: string | undefined,
  formFactor: FormFactor,
) => {
  const {data: activeBonusProducts} = useActiveBonusProductsQuery(
    Boolean(operatorId),
  );
  if (!operatorId) return undefined;
  return activeBonusProducts?.find(
    (bonusProduct) =>
      bonusProduct.formFactors.includes(formFactor) &&
      bonusProduct.operatorIds.includes(operatorId),
  );
};
