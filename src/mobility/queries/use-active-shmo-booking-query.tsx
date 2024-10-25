import {useQuery} from '@tanstack/react-query';
import {getActiveShmoBooking} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations.ts';
import {useAcceptLanguage} from '@atb/api/use-accept-language';

export const getActiveShmoBookingQueryKey = (acceptLanguage: string) => [
  'GET_ACTIVE_SHMO_BOOKING_QUERY_KEY',
  acceptLanguage,
];

export const useActiveShmoBookingQuery = () => {
  const acceptLanguage = useAcceptLanguage();
  return useQuery({
    queryKey: getActiveShmoBookingQueryKey(acceptLanguage),
    queryFn: ({signal}) => getActiveShmoBooking(acceptLanguage, {signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
  });
};
