import {PaymentType} from '@atb/ticketing';

export type CardPaymentMethod =
  | {paymentType: PaymentType.Visa | PaymentType.Mastercard; save: boolean}
  | {
      paymentType: PaymentType.Visa | PaymentType.Mastercard;
      recurringPaymentId: number;
    };

export type VippsPaymentMethod = {
  paymentType: PaymentType.Vipps;
};

export type PaymentMethod = VippsPaymentMethod | CardPaymentMethod;

export type SavedRecurringPayment = {
  id: number;
  expires_at: string;
  masked_pan: string;
  payment_type: number;
};

export type DefaultPaymentOption = {
  savedType: 'normal';
  paymentType: PaymentType;
};
export type RecurringPaymentOption = {
  savedType: 'recurring';
  paymentType: PaymentType.Visa | PaymentType.Mastercard;
  recurringCard: SavedRecurringPayment;
};
export type RecurringPaymentWithoutCardOption = {
  savedType: 'recurring-without-card';
  paymentType: PaymentType.Visa | PaymentType.Mastercard;
  recurringPaymentId: number;
};

export type SavedPaymentOption =
  | DefaultPaymentOption
  | RecurringPaymentOption
  | RecurringPaymentWithoutCardOption;
