import {
  type PurchaseSelectionType,
  useSelectableBaggageProducts,
} from '@atb/modules/purchase-selection';
import {BaggageProduct} from '@atb/modules/configuration';
import {useUniqueCountState} from '@atb/utils/unique-with-count';

const findBaggageProduct = (a: BaggageProduct, b: BaggageProduct) =>
  a.id === b.id;

export function useBaggageCountState(selection: PurchaseSelectionType) {
  const selectableBaggageProducts = useSelectableBaggageProducts(selection);
  const initialState = selectableBaggageProducts.map((b) => {
    return {
      ...b,
      count:
        selection.supplementProductsWithCount.find((sp) => sp.id === b.id)
          ?.count ?? 0,
    };
  });

  return useUniqueCountState<BaggageProduct>(initialState, findBaggageProduct);
}
