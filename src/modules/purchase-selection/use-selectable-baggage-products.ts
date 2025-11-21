import type {SupplementProduct} from '@atb-as/config-specs';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {useGetSupplementProductsQuery} from '../ticketing';

export function useSelectableBaggageProducts(
  selection: PurchaseSelectionType,
): SupplementProduct[] {
  const {data: allSupplementProducts} = useGetSupplementProductsQuery();
  return allSupplementProducts
    .filter((sp) => sp.isBaggageProduct)
    .filter((sp) => {
      return selection.preassignedFareProduct.limitations.supplementProductRefs?.some(
        (ref) => ref === sp.id,
      );
    });
}
