import {useQuery} from '@tanstack/react-query';
import {getShmoBooking} from '@atb/api/mobility';
import {ONE_HOUR_MS} from '@atb/utils/durations.ts';
import {ShmoBooking} from '@atb/api/types/mobility';

export const getShmoBookingQueryKey = (bookingId: ShmoBooking['bookingId']) => [
  'GET_SHMO_BOOKING_QUERY_KEY',
  bookingId,
];

export const useShmoBookingQuery = (bookingId?: ShmoBooking['bookingId']) => {
  const bookingIdString = bookingId || '';
  const isValidBookingId = !!bookingId && bookingIdString.trim() !== '';
  return useQuery({
    queryKey: getShmoBookingQueryKey(bookingIdString),
    queryFn: ({signal}) => getShmoBooking(bookingIdString, {signal}),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
    enabled: isValidBookingId,
  });
};
