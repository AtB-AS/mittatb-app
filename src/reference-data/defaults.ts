import {PreassignedFareProduct, TariffZone, UserProfile} from './types';
import preassignedFareProducts from './defaults/preassigned-fare-products.json';
import tariffZones from './defaults/tariff-zones.json';
import userProfiles from './defaults/user-profiles.json';
import {PaymentType} from '@atb/ticketing';

export const defaultPreassignedFareProducts =
  preassignedFareProducts as PreassignedFareProduct[];
export const defaultTariffZones: TariffZone[] = tariffZones;
export const defaultUserProfiles: UserProfile[] = userProfiles;
