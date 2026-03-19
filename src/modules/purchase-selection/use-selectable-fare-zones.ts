import type {FareZone} from '@atb-as/config-specs';
import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {isSelectableZone} from './utils';

export function useSelectableFareZones(
  product: PreassignedFareProduct,
): FareZone[] {
  const {fareZones} = useFirestoreConfigurationContext();
  return fareZones.filter((zone) => isSelectableZone(product, zone));
}
