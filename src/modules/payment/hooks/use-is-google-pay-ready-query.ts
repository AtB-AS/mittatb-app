import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS} from '@atb/utils/durations';
import {isGooglePayConfigured, isGooglePayReady} from '../google-pay';

/**
 * Whether Google Pay can be used on this device. Always false on iOS and when
 * Google Pay is not configured for the build.
 */
export const useIsGooglePayReadyQuery = () => {
  const {data} = useQuery({
    queryKey: ['isGooglePayReady'],
    queryFn: isGooglePayReady,
    enabled: isGooglePayConfigured(),
    staleTime: ONE_HOUR_MS,
  });
  return data ?? false;
};
