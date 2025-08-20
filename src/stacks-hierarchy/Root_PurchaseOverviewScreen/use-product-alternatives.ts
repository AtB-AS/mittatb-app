import {useMemo} from 'react';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';

export const useProductAlternatives = (selection: PurchaseSelectionType) => {
  const {data: preassignedFareProducts} = useGetFareProductsQuery();

  return useMemo(() => {
    const productAliasId = selection.preassignedFareProduct?.productAliasId;
    return productAliasId
      ? preassignedFareProducts.filter(
          (fp) => fp.productAliasId === productAliasId,
        )
      : [selection.preassignedFareProduct];
  }, [selection.preassignedFareProduct, preassignedFareProducts]);
};
