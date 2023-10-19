import {useEffect} from 'react';
import {LoadingState} from '@atb/loading-screen/types';
import {useAnalytics} from '@atb/analytics';

export const useLogEventOnTimeoutStatus = (
  status: LoadingState['status'],
  paramsRef: LoadingState['paramsRef'],
) => {
  const analytics = useAnalytics();
  useEffect(() => {
    if (status === 'timeout') {
      analytics.logEvent(
        'Loading boundary',
        'Loading boundary timeout',
        paramsRef.current || undefined,
      );
    }
  }, [analytics, status, paramsRef]);
};
