import type {SupplementProduct} from '@atb-as/config-specs';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';

export function useSelectableSupplementProducts(): SupplementProduct[] {
  const {supplementProducts} = useFirestoreConfigurationContext();
  return supplementProducts;
}
