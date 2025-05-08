import {PaymentType, RecurringPayment} from '@atb/modules/ticketing';

export type CardPaymentMethod = {
  paymentType:
    | PaymentType.Mastercard
    | PaymentType.Visa
    | PaymentType.Amex
    | PaymentType.PaymentCard;
  recurringPayment?: RecurringPayment;
};
export type VippsPaymentMethod = {
  paymentType: PaymentType.Vipps;
  recurringPayment?: undefined;
};
export type PaymentMethod = CardPaymentMethod | VippsPaymentMethod;

export type PaymentSelection =
  | {
      paymentType: PaymentType.Vipps;
    }
  | {
      paymentType: PaymentType.PaymentCard;
      shouldSavePaymentMethod: boolean;
    }
  | {
      paymentType: PaymentType.Mastercard | PaymentType.Visa | PaymentType.Amex;
      recurringPayment?: RecurringPayment;
    };
