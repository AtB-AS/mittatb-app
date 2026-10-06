import {useQuery} from '@tanstack/react-query';
import {getActiveShmoBooking} from '@atb/api/mobility';
import {ONE_MINUTE_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {languageGlobal} from '@atb/modules/locale';

export const getActiveShmoBookingQueryKey = (acceptLanguage: string) => [
  'GET_ACTIVE_SHMO_BOOKING_QUERY_KEY',
  acceptLanguage,
];

export const useActiveShmoBookingQuery = (
  enabled: boolean,
  refetchInterval?: number | false,
) => {
  const acceptLanguage = languageGlobal;

  const {isShmoDeepIntegrationEnabled, isEventStreamEnabled} =
    useFeatureTogglesContext();

  const effectiveRefetchInterval = isEventStreamEnabled
    ? ONE_SECOND_MS * 90
    : refetchInterval;

  const queryEnabled = enabled && isShmoDeepIntegrationEnabled;

  const {data, isLoading, isError, isPending, isSuccess} = useQuery({
    enabled: queryEnabled,
    queryKey: getActiveShmoBookingQueryKey(acceptLanguage),
    queryFn: ({signal}) => getActiveShmoBooking(acceptLanguage, {signal}),
    staleTime: ONE_MINUTE_MS,
    gcTime: ONE_MINUTE_MS,
    refetchInterval: effectiveRefetchInterval,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: true,
  });

  return {
    data,
    isLoading,
    isError,
    isSuccess,
    // isPending stays true forever on a disabled query, so resolve it here
    // rather than making callers account for the toggle themselves.
    isPending: queryEnabled && isPending,
  };
};
