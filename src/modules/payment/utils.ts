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
