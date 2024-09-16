import {useMutation, useQueryClient} from '@tanstack/react-query';
import {initShmoOneStopBooking} from '@atb/api/mobility';
import {GET_ACTIVE_SHMO_BOOKING_QUERY_KEY} from './use-active-shmo-booking-query';
import {ShmoBooking} from '@atb/api/types/mobility';

export const useInitShmoOneStopBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initShmoOneStopBooking,
    onSuccess: (data: ShmoBooking) => {
      // as long as you can only have one shmo booking at a time,
      // the new booking should always be the active one
      queryClient.setQueryData(GET_ACTIVE_SHMO_BOOKING_QUERY_KEY, data);
    },
  });
};
