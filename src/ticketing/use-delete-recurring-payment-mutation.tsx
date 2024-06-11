import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteRecurringPayment} from '@atb/ticketing';
import { LIST_RECURRING_PAYMENTS_QUERY_KEY } from './use-list-recurring-payments-query';

export const DELETE_RECURRING_PAYMENT_MUTATION_KEY = 'deleteRecurringPayment';

export const useDeleteRecurringPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DELETE_RECURRING_PAYMENT_MUTATION_KEY],
    mutationFn: (recurringPaymentId: number) =>
      deleteRecurringPayment(recurringPaymentId),
    onSuccess: () => queryClient.invalidateQueries([LIST_RECURRING_PAYMENTS_QUERY_KEY]) 
  });
}
