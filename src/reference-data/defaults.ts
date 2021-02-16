import {PreassignedFareProduct, TariffZone, UserProfile} from './types';
import preassignedFareProducts from './preassigned-fare-products.json';
import tariffZones from './tariff-zones.json';
import userProfiles from './user-profiles.json';

export const defaultPreassignedFareProducts: PreassignedFareProduct[] = preassignedFareProducts.map(
  (p) => ({
    ...p,
    // Todo: Temporaraily mocked value until flag is added in RemoteConfig
    type: p.name.value === '30-dagersbillett' ? 'period' : 'single',
  }),
);
export const defaultTariffZones: TariffZone[] = tariffZones;
export const defaultUserProfiles: UserProfile[] = userProfiles;
