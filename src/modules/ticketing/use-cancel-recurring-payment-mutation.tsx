import {useMutation} from '@tanstack/react-query';
import {cancelRecurringPayment} from '@atb/modules/ticketing';

export const CANCEL_RECURRING_PAYMENT_MUTATION_KEY = 'cancelRecurringPayment';

export const useCancelRecurringPaymentMutation = () =>
  useMutation({
    mutationKey: [CANCEL_RECURRING_PAYMENT_MUTATION_KEY],
    mutationFn: (recurringPaymentId: number) =>
      cancelRecurringPayment(recurringPaymentId),
  });
