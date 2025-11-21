import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {useGetSupplementProductsQuery} from '../ticketing';
import type {BaggageProduct} from '@atb/modules/fare-contracts';

export function useSelectableBaggageProducts(
  selection: PurchaseSelectionType,
): BaggageProduct[] {
  const {data: allSupplementProducts} = useGetSupplementProductsQuery();
  return allSupplementProducts
    .filter(
      (sp): sp is BaggageProduct =>
        sp.isBaggageProduct == true && sp.baggageType != null,
    )
    .filter((sp) => {
      return selection.preassignedFareProduct.limitations.supplementProductRefs?.some(
        (ref) => ref === sp.id,
      );
    });
}
