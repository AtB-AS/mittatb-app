import {PreassignedFareProduct, type TariffZone} from '@atb-as/config-specs';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {isSelectableZone} from './utils';

export function useSelectableTariffZones(
  product: PreassignedFareProduct,
): TariffZone[] {
  const {tariffZones} = useFirestoreConfigurationContext();
  return tariffZones.filter((zone) => isSelectableZone(product, zone));
}
