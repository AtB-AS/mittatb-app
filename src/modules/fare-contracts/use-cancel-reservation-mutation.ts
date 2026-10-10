import {useMutation, useMutationState} from '@tanstack/react-query';
import {cancelPayment, Reservation} from '@atb/modules/ticketing';
import {useAnalyticsContext} from '@atb/modules/analytics';

const getMutationKey = (orderId: string) => ['cancelReservation', orderId];

export const useCancelReservationMutation = (reservation: Reservation) => {
  const analytics = useAnalyticsContext();
  return useMutation({
    mutationKey: getMutationKey(reservation.orderId),
    mutationFn: () =>
      cancelPayment(reservation.paymentId, reservation.transactionId, true),
    onSuccess: () => analytics.logEvent('Ticketing', 'Payment cancelled'),
  });
};

/**
 * Firestore may never report the cancellation, so rely on the mutation cache
 * instead. Survives remounts of the reservation component.
 */
export const useIsReservationCancelled = (orderId: string) =>
  useMutationState({
    filters: {mutationKey: getMutationKey(orderId), status: 'success'},
  }).length > 0;
