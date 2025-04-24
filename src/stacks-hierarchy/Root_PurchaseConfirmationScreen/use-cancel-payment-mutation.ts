import {cancelPayment, OfferReservation} from '@atb/ticketing';
import {useMutation} from '@tanstack/react-query';

type Params = {
  reservation: OfferReservation;
  /** Whether or not the cancellation was triggered manually by a user */
  isUser: boolean;
};
export const useCancelPaymentMutation = () =>
  useMutation({
    mutationFn: ({reservation, isUser}: Params) =>
      cancelPayment(reservation.payment_id, reservation.transaction_id, isUser),
  });
