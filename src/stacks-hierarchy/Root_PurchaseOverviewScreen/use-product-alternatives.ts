import {useMemo} from 'react';
import type {PurchaseSelectionType} from '@atb/purchase-selection';
import {useFirestoreConfigurationContext} from '@atb/configuration';

export const useProductAlternatives = (selection: PurchaseSelectionType) => {
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  return useMemo(() => {
    const productAliasId = selection.preassignedFareProduct?.productAliasId;
    return productAliasId
      ? preassignedFareProducts.filter(
          (fp) => fp.productAliasId === productAliasId,
        )
      : [selection.preassignedFareProduct];
  }, [selection.preassignedFareProduct, preassignedFareProducts]);
};
