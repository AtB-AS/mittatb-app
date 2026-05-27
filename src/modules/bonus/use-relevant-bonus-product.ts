import {useActiveBonusProductsQuery} from './queries';
import {BonusProductTypeEnum} from './types';

export const useRelevantSharedMobilityBonusProduct = (
  vehicleTypeId: string | undefined,
) => {
  const {data: activeBonusProducts} = useActiveBonusProductsQuery(
    Boolean(vehicleTypeId),
  );
  if (!vehicleTypeId) return undefined;
  return activeBonusProducts?.find(
    (bonusProduct) =>
      bonusProduct.productType === BonusProductTypeEnum.SHARED_MOBILITY &&
      bonusProduct.vehicleTypeIds.includes(vehicleTypeId),
  );
};

export const useRelevantVoucherBonusProduct = (
  operatorId: string | undefined,
) => {
  const {data: activeBonusProducts} = useActiveBonusProductsQuery(
    Boolean(operatorId),
  );
  if (!operatorId) return undefined;
  return activeBonusProducts?.find(
    (bonusProduct) =>
      bonusProduct.productType === BonusProductTypeEnum.VOUCHER &&
      bonusProduct.operatorId === operatorId,
  );
};
