import React, {createContext, useContext, useEffect, useState} from 'react';
import PostHog, {PostHogProvider} from 'posthog-react-native';
import {POSTHOG_API_KEY, POSTHOG_HOST} from '@env';
import {useNavigationSafe} from '@atb/utils/use-navigation-safe';
import {AnalyticsEventContext} from '@atb/analytics/analytics-event-context';

export const AnalyticsContext = createContext<PostHog | undefined>(undefined);

export const AnalyticsContextProvider: React.FC = ({children}) => {
  const [client, setClient] = useState<PostHog>();
  const navigation = useNavigationSafe();

  useEffect(() => {
    if (POSTHOG_HOST && POSTHOG_API_KEY) {
      PostHog.initAsync(POSTHOG_API_KEY, {
        host: POSTHOG_HOST,
      }).then(setClient);
    }
  }, []);

  // PostHog's auto capture feature enables auto capture of navigation events,
  // but for this to work, the PostHog provider must be set up within a React Navigation object.
  // However, if no navigation is available (such as in the bottom sheet),
  // attempting to use the PostHogProvider will result in an error.
  // In such cases, the AnalyticsContext must be configured without the PostHogProvider.
  // This means that only events that have been explicitly logged will be available in the bottom sheet,
  // and similar contexts.
  return (
    <AnalyticsContext.Provider value={client}>
      {navigation ? (
        <PostHogProvider client={client}>{children}</PostHogProvider>
      ) : (
        <>{children}</>
      )}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const postHog = useContext(AnalyticsContext);
  const logEvent = (
    context: AnalyticsEventContext,
    event: string,
    properties?: {[key: string]: any},
  ) => {
    postHog?.capture(`${context}: ${event}`, properties);
  };

  return {
    logEvent,
  };
};
