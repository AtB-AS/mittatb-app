import {useQuery} from '@tanstack/react-query';
import {getActiveShmoBooking} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations.ts';

export const GET_ACTIVE_SHMO_BOOKING_QUERY_KEY = [
  'GET_ACTIVE_SHMO_BOOKING_QUERY_KEY',
];

export const useActiveShmoBookingQuery = () => {
  return useQuery({
    queryKey: GET_ACTIVE_SHMO_BOOKING_QUERY_KEY,
    queryFn: ({signal}) => getActiveShmoBooking({signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
  });
};
