import type {PreassignedFareProduct} from '@atb-as/config-specs';
import type {SupplementaryProduct} from '@atb/modules/fare-contracts';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';

export function useSelectableSupplementaryProducts(
  product: PreassignedFareProduct,
): SupplementaryProduct[] {
  const {} = useFirestoreConfigurationContext();
}
