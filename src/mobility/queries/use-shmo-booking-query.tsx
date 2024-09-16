import {useQuery} from '@tanstack/react-query';
import {getShmoBooking} from '@atb/api/mobility';
import {ONE_HOUR_MS} from '@atb/utils/durations.ts';
import {ShmoBooking} from '@atb/api/types/mobility';

export const getShmoBookingQueryKey = (bookingId: ShmoBooking['bookingId']) => [
  'GET_SHMO_BOOKING_QUERY_KEY',
  bookingId,
];

export const useShmoBookingQuery = (bookingId: ShmoBooking['bookingId']) => {
  return useQuery({
    queryKey: getShmoBookingQueryKey(bookingId),
    queryFn: ({signal}) => getShmoBooking(bookingId, {signal}),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
};
