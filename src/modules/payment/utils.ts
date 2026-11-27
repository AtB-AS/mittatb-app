import {RequiredField} from '@atb/utils/object';
import {CardPaymentMethod, PaymentMethod} from './types';
import {NonRecurringPaymentType, PaymentType} from '../ticketing';

export function isCardPaymentMethod(
  payment: PaymentMethod | undefined,
): payment is RequiredField<CardPaymentMethod, 'recurringPayment'> {
  return !!payment && !!payment.recurringPayment;
}

export function isNonRecurringPaymentType(
  paymentType: PaymentType,
): paymentType is NonRecurringPaymentType {
  return (
    paymentType === PaymentType.Vipps ||
    paymentType === PaymentType.ApplePay ||
    paymentType === PaymentType.GooglePay
  );
}

/**
 * Wallet payments send the payment data with reserve, so the card may be
 * charged as part of the reserve call.
 */
export function isWalletPaymentType(
  paymentType: PaymentType | undefined,
): boolean {
  return (
    paymentType === PaymentType.ApplePay ||
    paymentType === PaymentType.GooglePay
  );
}
