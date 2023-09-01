import {PaymentType} from '@atb/ticketing/types';

export const defaultModesWeSellTicketsFor: string[] = [
  'cityTram',
  'expressBus',
  'localBus',
  'localTram',
  'regionalBus',
  'shuttleBus',
  'highSpeedPassengerService',
  'highSpeedVehicleService',
];
export const defaultPaymentTypes: PaymentType[] = [
  PaymentType.Vipps,
  PaymentType.Visa,
  PaymentType.Mastercard,
];
export const defaultVatPercent: number = 12;
