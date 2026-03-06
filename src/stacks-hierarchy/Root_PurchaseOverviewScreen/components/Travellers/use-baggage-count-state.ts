import {
  type PurchaseSelectionType,
  useSelectableBaggageProducts,
} from '@atb/modules/purchase-selection';
import {BaggageProduct} from '@atb/modules/configuration';
import {useUniqueCountState} from '@atb/utils/unique-with-count';
import {useAuthContext} from '@atb/modules/auth';

const findBaggageProduct = (a: BaggageProduct, b: BaggageProduct) =>
  a.id === b.id;

export function useBaggageCountState(selection: PurchaseSelectionType) {
  const selectableBaggageProducts = useSelectableBaggageProducts(selection);
  const {authenticationType} = useAuthContext();
  const initialState = selectableBaggageProducts.map((b) => {
    const limitation =
      selection.preassignedFareProduct.limitations.supplementProducts.find(
        (spl) => spl.targetRef === b.id,
      );
    return {
      ...b,
      count:
        selection.supplementProductsWithCount.find((sp) => sp.id === b.id)
          ?.count ?? 0,
      limit:
        authenticationType === 'phone'
          ? limitation?.limitPerOrderLoggedIn
          : limitation?.limitPerOrderLoggedOut,
    };
  });

  return useUniqueCountState<BaggageProduct>(initialState, findBaggageProduct);
}
