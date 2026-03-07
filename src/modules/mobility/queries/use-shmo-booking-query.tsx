import {useQuery} from '@tanstack/react-query';
import {getShmoBooking} from '@atb/api/mobility';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {ShmoBooking} from '@atb/api/types/mobility';
import {useAcceptLanguage} from '@atb/api/use-accept-language';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const getShmoBookingQueryKey = (
  bookingId: ShmoBooking['bookingId'],
  acceptLanguage?: string,
) => ['GET_SHMO_BOOKING_QUERY_KEY', bookingId, acceptLanguage];

export const useShmoBookingQuery = (
  enabled: boolean,
  bookingId?: ShmoBooking['bookingId'],
  refetchInterval?: number | false,
) => {
  const acceptLanguage = useAcceptLanguage();
  const {isShmoDeepIntegrationEnabled, isEventStreamEnabled} =
    useFeatureTogglesContext();
  const bookingIdString = bookingId || '';
  const isValidBookingId = !!bookingId && bookingIdString.trim() !== '';

  const effectiveRefetchInterval = isEventStreamEnabled
    ? ONE_SECOND_MS * 90
    : refetchInterval;

  return useQuery({
    queryKey: getShmoBookingQueryKey(bookingIdString, acceptLanguage),
    queryFn: ({signal}) =>
      getShmoBooking(bookingIdString, acceptLanguage, {signal}),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
    enabled: enabled && isValidBookingId && isShmoDeepIntegrationEnabled,
    refetchInterval: effectiveRefetchInterval,
  });
};
