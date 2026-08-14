import {useActiveBonusProductsQuery} from './queries';
import type {BonusProductType} from './types';

export const useBonusProductById = (
  id: string | undefined,
): BonusProductType | undefined => {
  const {data: activeBonusProducts} = useActiveBonusProductsQuery(Boolean(id));
  if (!id) return undefined;
  return activeBonusProducts?.find((bonusProduct) => bonusProduct.id === id);
};
