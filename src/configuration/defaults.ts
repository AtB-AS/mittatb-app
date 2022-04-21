import {PaymentType} from '@atb/tickets/types';

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
