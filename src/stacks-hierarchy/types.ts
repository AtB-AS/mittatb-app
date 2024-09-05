import {PaymentType} from '@atb/ticketing';

export type RecurringCard = {
  id: number;
  expires_at: string;
  masked_pan: string;
  payment_type: number;
};

type CardPaymentMethod = {
  savedType: 'recurring' | 'normal';
  paymentType: PaymentType.Mastercard | PaymentType.Visa;
  recurringCard?: RecurringCard;
};
type VippsPaymentMethod = {
  savedType: 'normal';
  paymentType: PaymentType.Vipps;
  recurringCard?: undefined;
};
export type PaymentMethod = CardPaymentMethod | VippsPaymentMethod;

export type PaymentProcessorStatus = 'loading' | 'success' | 'error';

export type TicketRecipientType = {
  accountId: string;
  phoneNumber: string;
  name?: string;
};
