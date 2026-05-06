import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useActiveBonusProductsQuery} from './queries';
import {BonusProductType} from './types';

export const useRelevantBonusProduct = (
  operatorId: string | undefined,
  formFactor: FormFactor,
  productType?: BonusProductType['productType'],
) => {
  const {data: activeBonusProducts} = useActiveBonusProductsQuery(
    Boolean(operatorId),
  );
  if (!operatorId) return undefined;
  return activeBonusProducts?.find(
    (bonusProduct) =>
      bonusProduct.formFactors.includes(formFactor) &&
      bonusProduct.operatorIds.includes(operatorId) &&
      (!productType || bonusProduct.productType === productType),
  );
};
