import {RequiredField} from '@atb/utils/object';
import {CardPaymentMethod, PaymentMethod} from './types';

export function isCardPaymentMethod(
  payment: PaymentMethod | undefined,
): payment is RequiredField<CardPaymentMethod, 'recurringCard'> {
  return !!payment && !!payment.recurringCard;
}
