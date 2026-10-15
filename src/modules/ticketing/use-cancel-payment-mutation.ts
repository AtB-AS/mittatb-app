import {useMutation} from '@tanstack/react-query';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {cancelPayment} from './api';
import {ReserveOfferResponse} from './types';

type Variables = {
  payment: Pick<ReserveOfferResponse, 'paymentId' | 'transactionId'>;
  /** Whether or not the cancellation was triggered manually by a user */
  isUser: boolean;
};

export const useCancelPaymentMutation = (options?: {
  onSuccess?: () => void;
}) => {
  const analytics = useAnalyticsContext();
  return useMutation({
    mutationFn: ({payment, isUser}: Variables) => {
      if (!payment.paymentId || !payment.transactionId) {
        return Promise.resolve();
      }
      return cancelPayment(payment.paymentId, payment.transactionId, isUser);
    },
    onSuccess: () => {
      analytics.logEvent('Ticketing', 'Payment cancelled');
      options?.onSuccess?.();
    },
  });
};
