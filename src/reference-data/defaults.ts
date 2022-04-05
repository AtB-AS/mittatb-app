import {PreassignedFareProduct, TariffZone, UserProfile} from './types';
import preassignedFareProducts from './preassigned-fare-products.json';
import tariffZones from './tariff-zones.json';
import userProfiles from './user-profiles.json';

export const defaultPreassignedFareProducts =
  preassignedFareProducts as PreassignedFareProduct[];

export const defaultTariffZones: TariffZone[] = tariffZones;
export const defaultUserProfiles: UserProfile[] = userProfiles;
