import {cancelPayment, ReserveOfferResponse} from '@atb/ticketing';
import {useMutation} from '@tanstack/react-query';

type Params = {
  reserveOfferResponse: ReserveOfferResponse;
  /** Whether or not the cancellation was triggered manually by a user */
  isUser: boolean;
};
export const useCancelPaymentMutation = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) =>
  useMutation({
    mutationFn: ({reserveOfferResponse, isUser}: Params) =>
      cancelPayment(
        reserveOfferResponse.paymentId,
        reserveOfferResponse.transactionId,
        isUser,
      ),
    onSuccess,
  });
