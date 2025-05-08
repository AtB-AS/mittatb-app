import {PaymentType, RecurringPayment} from '@atb/modules/ticketing';

export type CardPaymentMethod = {
  paymentType:
    | PaymentType.Mastercard
    | PaymentType.Visa
    | PaymentType.Amex
    | PaymentType.PaymentCard;
  recurringCard?: RecurringPayment;
};
export type VippsPaymentMethod = {
  paymentType: PaymentType.Vipps;
  recurringCard?: undefined;
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
      recurringCard?: RecurringPayment;
    };
