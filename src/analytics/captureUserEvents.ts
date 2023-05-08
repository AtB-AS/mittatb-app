import {useContext} from 'react';
import {AnalyticsContext} from '@atb/analytics/AnalyticsContext';

export const useEventCapture = () => {
  const postHog = useContext(AnalyticsContext);
  const capture = async (event: string, properties?: {[key: string]: any}) => {
    (await postHog)?.capture(event, properties);
  };

  return {
    capture,
  };
};
