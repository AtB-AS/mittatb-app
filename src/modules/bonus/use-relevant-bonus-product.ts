import {useActiveBonusProductsQuery} from './queries';
import {BonusProductTypeEnum} from './types';

export const useRelevantBonusProduct = (
  vehicleTypeId: string | undefined,
  productType?: BonusProductTypeEnum,
) => {
  const {data: activeBonusProducts} = useActiveBonusProductsQuery(
    Boolean(vehicleTypeId),
  );
  if (!vehicleTypeId) return undefined;
  return activeBonusProducts?.find(
    (bonusProduct) =>
      bonusProduct.vehicleTypeIds.includes(vehicleTypeId) &&
      (!productType || bonusProduct.productType === productType),
  );
};
