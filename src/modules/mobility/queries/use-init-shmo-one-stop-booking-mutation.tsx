import {useMutation, useQueryClient} from '@tanstack/react-query';
import {initShmoOneStopBooking} from '@atb/api/mobility';
import {getActiveShmoBookingQueryKey} from './use-active-shmo-booking-query';
import {
  InitShmoOneStopBookingRequestBody,
  ShmoBooking,
} from '@atb/api/types/mobility';
import {useAcceptLanguage} from '@atb/api/use-accept-language';

export const useInitShmoOneStopBookingMutation = () => {
  const queryClient = useQueryClient();
  const acceptLanguage = useAcceptLanguage();

  return useMutation({
    mutationFn: (reqBody: InitShmoOneStopBookingRequestBody) =>
      initShmoOneStopBooking(reqBody, acceptLanguage),
    onSuccess: (data: ShmoBooking) => {
      // as long as you can only have one shmo booking at a time,
      // the new booking should always be the active one
      queryClient.setQueryData(
        getActiveShmoBookingQueryKey(acceptLanguage),
        data,
      );
    },
  });
};
