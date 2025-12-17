import {useMemo} from 'react';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {useGetFareProductsQuery} from './use-get-fare-products-query';
import {isDefined} from '@atb/utils/presence';

export const useProductAlternatives = (selection?: PurchaseSelectionType) => {
  const {data: preassignedFareProducts} = useGetFareProductsQuery();

  return useMemo(() => {
    const productAliasId = selection?.preassignedFareProduct?.productAliasId;
    const value = productAliasId
      ? preassignedFareProducts.filter(
          (fp) => fp.productAliasId === productAliasId,
        )
      : [selection?.preassignedFareProduct];
    return value.filter(isDefined);
  }, [selection?.preassignedFareProduct, preassignedFareProducts]);
};
