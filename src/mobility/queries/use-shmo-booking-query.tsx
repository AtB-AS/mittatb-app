import {useQuery} from '@tanstack/react-query';
import {getShmoBooking} from '@atb/api/mobility';
import {ONE_HOUR_MS} from '@atb/utils/durations';
import {ShmoBooking} from '@atb/api/types/mobility';
import {useAcceptLanguage} from '@atb/api/use-accept-language';

export const getShmoBookingQueryKey = (
  bookingId: ShmoBooking['bookingId'],
  acceptLanguage: string,
) => ['GET_SHMO_BOOKING_QUERY_KEY', bookingId, acceptLanguage];

export const useShmoBookingQuery = (bookingId?: ShmoBooking['bookingId']) => {
  const acceptLanguage = useAcceptLanguage();

  const bookingIdString = bookingId || '';
  const isValidBookingId = !!bookingId && bookingIdString.trim() !== '';

  return useQuery({
    queryKey: getShmoBookingQueryKey(bookingIdString, acceptLanguage),
    queryFn: ({signal}) =>
      getShmoBooking(bookingIdString, acceptLanguage, {signal}),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
    enabled: isValidBookingId,
  });
};
