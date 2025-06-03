import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getActiveShmoBooking} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {useAcceptLanguage} from '@atb/api/use-accept-language';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useEffect} from 'react';
import {getShmoBookingQueryKey} from './use-shmo-booking-query';

export const getActiveShmoBookingQueryKey = (acceptLanguage: string) => [
  'GET_ACTIVE_SHMO_BOOKING_QUERY_KEY',
  acceptLanguage,
];

export const useActiveShmoBookingQuery = (
  refetchInterval: number | false = false,
) => {
  const acceptLanguage = useAcceptLanguage();
  const queryClient = useQueryClient();
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();
  const res = useQuery({
    enabled: isShmoDeepIntegrationEnabled,
    queryKey: getActiveShmoBookingQueryKey(acceptLanguage),
    queryFn: ({signal}) => getActiveShmoBooking(acceptLanguage, {signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
    refetchInterval,
  });

  useEffect(() => {
    if (res.status === 'success' && res.data) {
      queryClient.setQueryData(
        getShmoBookingQueryKey(res.data.bookingId, acceptLanguage),
        res.data,
      );
    }
  }, [res.status, res.data, queryClient, acceptLanguage]);

  return res;
};
