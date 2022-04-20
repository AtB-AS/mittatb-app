import {PreassignedFareProduct, TariffZone, UserProfile} from './types';
import preassignedFareProducts from './defaults/preassigned-fare-products.json';
import tariffZones from './defaults/tariff-zones.json';
import userProfiles from './defaults/user-profiles.json';
import {PaymentType} from '@atb/tickets';

export const defaultPreassignedFareProducts =
  preassignedFareProducts as PreassignedFareProduct[];
export const defaultTariffZones: TariffZone[] = tariffZones;
export const defaultUserProfiles: UserProfile[] = userProfiles;
export const defaultModesWeSellTicketsFor: string[] = [
  'cityTram',
  'expressBus',
  'localBus',
  'localTram',
  'regionalBus',
  'shuttleBus',
];
export const defaultPaymentTypes: string[] = ['vipps', 'visa', 'mastercard'];
export const defaultVatPercent: number = 12;
