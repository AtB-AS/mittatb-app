import {PaymentType, RecurringPayment} from '@atb/ticketing';

type CardPaymentMethod = {
  savedType: 'recurring' | 'normal';
  paymentType: PaymentType.Mastercard | PaymentType.Visa;
  recurringCard?: RecurringPayment;
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
