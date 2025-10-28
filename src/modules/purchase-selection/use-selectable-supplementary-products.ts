import type {
  PreassignedFareProduct,
  SupplementProduct,
} from '@atb-as/config-specs';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';

export function useSelectableSupplementaryProducts(
  product: PreassignedFareProduct,
): SupplementProduct[] {
  const {supplementProducts} = useFirestoreConfigurationContext();
}
