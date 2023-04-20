import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
  CityZone,
  CityZoneMessageTexts,
} from './types';
import {FareProductTypeConfig} from '@atb/configuration';
import preassignedFareProducts from './defaults/preassigned-fare-products.json';
import tariffZones from './defaults/tariff-zones.json';
import cityZones from './defaults/city-zones.json';
import cityZoneMessageTexts from './defaults/city-zones-message-texts.json';
import userProfiles from './defaults/user-profiles.json';
import fareProductTypeConfig from './defaults/fare-product-type-config.json';

export const defaultPreassignedFareProducts =
  preassignedFareProducts as PreassignedFareProduct[];
export const defaultTariffZones: TariffZone[] = tariffZones;
export const defaultCityZones: CityZone[] = cityZones;
export const defaultCityZoneMessageTexts: CityZoneMessageTexts =
  cityZoneMessageTexts;
export const defaultUserProfiles: UserProfile[] = userProfiles;
export const defaultFareProductTypeConfig =
  fareProductTypeConfig as FareProductTypeConfig[];
