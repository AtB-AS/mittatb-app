import {useMemo} from 'react';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';

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
