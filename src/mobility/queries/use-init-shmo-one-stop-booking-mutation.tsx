import {useMutation, useQueryClient} from '@tanstack/react-query';
import {initShmoOneStopBooking} from '@atb/api/mobility';
import {GET_ACTIVE_SHMO_BOOKING_QUERY_KEY} from './use-active-shmo-booking-query';

export const useInitShmoOneStopBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initShmoOneStopBooking,
    onSuccess: (data) => {
      // as long as you can only have one shmo booking at a time,
      // the new booking should always be the active ones
      queryClient.setQueryData(GET_ACTIVE_SHMO_BOOKING_QUERY_KEY, data);
    },
  });
};
