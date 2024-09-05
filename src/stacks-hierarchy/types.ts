import {PaymentType} from '@atb/ticketing';

export type SavedRecurringPayment = {
  id: number;
  expires_at: string;
  masked_pan: string;
  payment_type: number;
};

export type PaymentOption = {
  savedType: 'normal' | 'recurring';
  paymentType: PaymentType;
  recurringCard?: SavedRecurringPayment;
};

export type PaymentProcessorStatus = 'loading' | 'success' | 'error';

export type TicketRecipientType = {
  accountId: string;
  phoneNumber: string;
  name?: string;
};
