import {PaymentType} from '@atb/tickets';

export type CardPaymentMethod =
  | {paymentType: PaymentType.VISA | PaymentType.MasterCard; save: boolean}
  | {
      paymentType: PaymentType.VISA | PaymentType.MasterCard;
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
  paymentType: PaymentType.VISA | PaymentType.MasterCard;
  recurringCard: SavedRecurringPayment;
};

export type SavedPaymentOption = DefaultPaymentOption | RecurringPaymentOption;
