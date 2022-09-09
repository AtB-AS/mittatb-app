import {PaymentType} from '@atb/tickets';
import {TicketsTexts, TranslateFunction} from '@atb/translations';

export const getPaymentMode = (
  paymentType: PaymentType,
  t: TranslateFunction,
) => {
  return paymentType === PaymentType.Vipps
    ? t(TicketsTexts.reservation.paymentType.vipps)
    : t(TicketsTexts.reservation.paymentType.creditcard);
};
