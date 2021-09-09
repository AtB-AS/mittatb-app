import {PaymentType} from '@atb/tickets';

export type CardPaymentMethod =
  | {paymentType: PaymentType.VISA | PaymentType.MasterCard; save: boolean}
  | {
      paymentType: PaymentType.VISA | PaymentType.MasterCard;
      recurringPaymentId: number;
    };

export type PaymentMethod =
  | {paymentType: PaymentType.Vipps}
  | CardPaymentMethod;
