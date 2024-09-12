import {PaymentType, RecurringPayment} from '@atb/ticketing';

export enum SavedPaymentMethodType {
  /**
   * Contains only the type of payment, and no payment details. When used, the
   * user has to enter the payment details manually or pay through a third party
   * like Vipps.
   */
  Normal = 'normal',
  /**
   * Contains the type of payment and information to enable automatic payment
   * without entering more payment details. BankID might still be required.
   */
  Recurring = 'recurring',
}

type CardPaymentMethod = {
  savedType: SavedPaymentMethodType;
  paymentType: PaymentType.Mastercard | PaymentType.Visa;
  recurringCard?: RecurringPayment;
};
type VippsPaymentMethod = {
  savedType: SavedPaymentMethodType.Normal;
  paymentType: PaymentType.Vipps;
  recurringCard?: undefined;
};
export type PaymentMethod = CardPaymentMethod | VippsPaymentMethod;

export type TicketRecipientType = {
  accountId: string;
  phoneNumber: string;
  name?: string;
};
