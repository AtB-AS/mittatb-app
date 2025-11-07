import type {SupplementProduct} from '@atb-as/config-specs';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';

export function useSelectableSupplementProducts(
  selection: PurchaseSelectionType,
): SupplementProduct[] {
  const {supplementProducts} = useFirestoreConfigurationContext();
  return supplementProducts.filter((sp) => {
    return selection.preassignedFareProduct.limitations.supplementProductRefs?.some(
      (ref) => ref === sp.id,
    );
  });
}
