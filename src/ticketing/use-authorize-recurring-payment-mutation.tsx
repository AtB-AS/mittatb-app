import {useMutation, useQueryClient} from '@tanstack/react-query';
import {authorizeRecurringPayment} from '@atb/ticketing';
import {LIST_RECURRING_PAYMENTS_QUERY_KEY} from './use-list-recurring-payments-query';

export const AUTHORIZE_RECURRING_PAYMENT_QUERY_KEY =
  'authorizeRecurringPayment';

export const useAuthorizeRecurringPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [AUTHORIZE_RECURRING_PAYMENT_QUERY_KEY],
    mutationFn: (recurringPaymentId: number) =>
      authorizeRecurringPayment(recurringPaymentId),
    onSuccess: () =>
      queryClient.invalidateQueries([LIST_RECURRING_PAYMENTS_QUERY_KEY]),
  });
};
