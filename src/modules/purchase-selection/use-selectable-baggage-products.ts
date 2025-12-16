import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {useGetSupplementProductsQuery} from '../ticketing';
import {BaggageProduct} from '@atb/modules/configuration';
import {isSelectableSupplementProduct} from './utils';

export function useSelectableBaggageProducts(
  selection: PurchaseSelectionType,
): BaggageProduct[] {
  const {data: allSupplementProducts} = useGetSupplementProductsQuery();
  return allSupplementProducts
    .map((sp) => BaggageProduct.safeParse(sp))
    .filter((sp) => sp.success)
    .map((sp) => sp.data)
    .filter((sp) => isSelectableSupplementProduct(selection, sp));
}
