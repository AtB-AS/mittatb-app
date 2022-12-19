import {FareProductTypeConfig} from '@atb/screens/Ticketing/FareContracts/utils';
import {PaymentType} from '@atb/ticketing/types';
import fareProductTypeConfig from './defaults/fare-product-type-config.json';

export const defaultModesWeSellTicketsFor: string[] = [
  'cityTram',
  'expressBus',
  'localBus',
  'localTram',
  'regionalBus',
  'shuttleBus',
];
export const defaultPaymentTypes: PaymentType[] = [
  PaymentType.Vipps,
  PaymentType.Visa,
  PaymentType.Mastercard,
];
export const defaultVatPercent: number = 12;

export const defaultFareProductTypeConfig =
  fareProductTypeConfig as FareProductTypeConfig[];
