import {cancelPayment, OfferReservation} from '@atb/ticketing';
import {useMutation} from '@tanstack/react-query';

export const useCancelPaymentMutation = () =>
  useMutation({
    mutationFn: (reservation: OfferReservation) =>
      cancelPayment(reservation.payment_id, reservation.transaction_id),
  });
