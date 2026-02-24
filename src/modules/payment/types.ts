import {
  NonRecurringPaymentType,
  PaymentType,
  RecurringPayment,
} from '@atb/modules/ticketing';

export type CardPaymentMethod = {
  paymentType:
    | PaymentType.Mastercard
    | PaymentType.Visa
    | PaymentType.Amex
    | PaymentType.PaymentCard;
  recurringPayment?: RecurringPayment;
};
export type NonRecurringPaymentMethod = {
  paymentType: NonRecurringPaymentType;
  recurringPayment?: undefined;
};
export type PaymentMethod = CardPaymentMethod | NonRecurringPaymentMethod;

export type PaymentSelection =
  | {
      paymentType: NonRecurringPaymentType;
    }
  | {
      paymentType: PaymentType.PaymentCard;
      shouldSavePaymentMethod: boolean;
    }
  | {
      paymentType: PaymentType.Mastercard | PaymentType.Visa | PaymentType.Amex;
      recurringPayment?: RecurringPayment;
    };
