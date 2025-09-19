import {useMutation, useQueryClient} from '@tanstack/react-query';
import {sendShmoBookingEvent} from '@atb/api/mobility';
import {getActiveShmoBookingQueryKey} from './use-active-shmo-booking-query';
import {
  ShmoBooking,
  ShmoBookingEvent,
  ShmoBookingEventType,
} from '@atb/api/types/mobility';
import {getShmoBookingQueryKey} from './use-shmo-booking-query';
import {useAcceptLanguage} from '@atb/api/use-accept-language';

type BookingEventArgs = {
  bookingId: ShmoBooking['bookingId'];
  shmoBookingEvent: ShmoBookingEvent;
};

export const useSendShmoBookingEventMutation = () => {
  const queryClient = useQueryClient();
  const acceptLanguage = useAcceptLanguage();

  return useMutation({
    mutationFn: ({bookingId, shmoBookingEvent}: BookingEventArgs) =>
      sendShmoBookingEvent(bookingId, shmoBookingEvent, acceptLanguage),

    onSuccess: (data: ShmoBooking, arg: BookingEventArgs) => {
      switch (arg.shmoBookingEvent.event) {
        case ShmoBookingEventType.START_FINISHING:
          queryClient.setQueryData(
            getActiveShmoBookingQueryKey(acceptLanguage),
            data,
          );
          queryClient.setQueryData(
            getShmoBookingQueryKey(data.bookingId, acceptLanguage),
            data,
          );
          break;
        case ShmoBookingEventType.FINISH:
          queryClient.setQueryData(
            getShmoBookingQueryKey(data.bookingId, acceptLanguage),
            data,
          );
          queryClient.invalidateQueries({
            queryKey: getActiveShmoBookingQueryKey(acceptLanguage),
          });
          break;
        default:
          break;
      }
    },
  });
};
