import {PreassignedFareProduct, TariffZone, UserProfile} from './types';
import {FareProductTypeConfig} from '@atb/screens/Ticketing/FareContracts/utils';
import preassignedFareProducts from './defaults/preassigned-fare-products.json';
import tariffZones from './defaults/tariff-zones.json';
import userProfiles from './defaults/user-profiles.json';
import fareProductTypeConfig from './defaults/fare-product-type-config.json';
import {PaymentType} from '@atb/ticketing';

export const defaultPreassignedFareProducts =
  preassignedFareProducts as PreassignedFareProduct[];
export const defaultTariffZones: TariffZone[] = tariffZones;
export const defaultUserProfiles: UserProfile[] = userProfiles;
export const defaultFareProductTypeConfig =
  fareProductTypeConfig as FareProductTypeConfig[];
