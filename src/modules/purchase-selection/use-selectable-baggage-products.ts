import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {useGetSupplementProductsQuery} from '../ticketing';
import {BaggageProduct} from '@atb/modules/configuration';

export function useSelectableBaggageProducts(
  selection: PurchaseSelectionType,
): BaggageProduct[] {
  const {data: allSupplementProducts} = useGetSupplementProductsQuery();
  return allSupplementProducts
    .map((sp) => BaggageProduct.safeParse(sp))
    .filter((sp) => sp.success)
    .map((sp) => sp.data)
    .filter((sp) => {
      return selection.preassignedFareProduct.limitations.supplementProductRefs?.some(
        (ref) => ref === sp.id,
      );
    });
}
