import React, {createContext, useContext, useEffect, useState} from 'react';
import PostHog, {PostHogProvider} from 'posthog-react-native';
import {POSTHOG_API_KEY, POSTHOG_HOST} from '@env';

export const AnalyticsContext = createContext<PostHog | undefined>(undefined);

export const AnalyticsContextProvider: React.FC = ({children}) => {
  const [client, setClient] = useState<PostHog>();

  useEffect(() => {
    if (POSTHOG_HOST && POSTHOG_API_KEY) {
      PostHog.initAsync(POSTHOG_API_KEY, {
        host: POSTHOG_HOST,
      }).then(setClient);
    }
  }, []);

  return (
    <AnalyticsContext.Provider value={client}>
      <PostHogProvider client={client}>{children}</PostHogProvider>
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const postHog = useContext(AnalyticsContext);
  const logEvent = (event: string, properties?: {[key: string]: any}) => {
    postHog?.capture(event, properties);
  };

  return {
    logEvent,
  };
};
