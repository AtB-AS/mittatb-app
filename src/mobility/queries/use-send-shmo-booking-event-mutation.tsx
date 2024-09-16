import {useMutation, useQueryClient} from '@tanstack/react-query';
import {sendShmoBookingEvent} from '@atb/api/mobility';
import {GET_ACTIVE_SHMO_BOOKING_QUERY_KEY} from './use-active-shmo-booking-query';
import {
  ShmoBooking,
  ShmoBookingEvent,
  ShmoBookingEventType,
} from '@atb/api/types/mobility';
import {getShmoBookingQueryKey} from './use-shmo-booking-query';

type BookingEventArgs = {
  bookingId: ShmoBooking['bookingId'];
  shmoBookingEvent: ShmoBookingEvent;
};

export const useSendShmoBookingEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({bookingId, shmoBookingEvent}: BookingEventArgs) =>
      sendShmoBookingEvent(bookingId, shmoBookingEvent),

    onSuccess: (data: ShmoBooking, arg: BookingEventArgs) => {
      switch (arg.shmoBookingEvent.event) {
        case ShmoBookingEventType.START_FINISHING:
          queryClient.setQueryData(GET_ACTIVE_SHMO_BOOKING_QUERY_KEY, data);
          break;
        case ShmoBookingEventType.FINISH:
          queryClient.setQueryData(
            getShmoBookingQueryKey(data.bookingId),
            data,
          );
          queryClient.invalidateQueries(GET_ACTIVE_SHMO_BOOKING_QUERY_KEY);
          break;
        default:
          break;
      }
    },
  });
};
