import {useQuery} from '@tanstack/react-query';
import {getActiveShmoBooking} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {useAcceptLanguage} from '@atb/api/use-accept-language';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const getActiveShmoBookingQueryKey = (acceptLanguage: string) => [
  'GET_ACTIVE_SHMO_BOOKING_QUERY_KEY',
  acceptLanguage,
];

export const useActiveShmoBookingQuery = () => {
  const acceptLanguage = useAcceptLanguage();
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();
  return useQuery({
    enabled: isShmoDeepIntegrationEnabled,
    queryKey: getActiveShmoBookingQueryKey(acceptLanguage),
    queryFn: ({signal}) => getActiveShmoBooking(acceptLanguage, {signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
  });
};
