import React, {createContext, useContext, useEffect, useState} from 'react';
import PostHog, {PostHogProvider} from 'posthog-react-native';
import {POSTHOG_API_KEY, POSTHOG_HOST} from '@env';
import {useNavigationSafe} from '@atb/utils/use-navigation-safe';

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

  // Since PostHog offers auto capture of navigation events,
  // the PostHog provider expects to be setup inside a React Navigation object.
  // In cases where the no navigation is available, e.g. the bottom sheet,
  // the PostHog provider will throw an error. In these cases, the
  // AnalyticsContext needs to be set up without the PostHogProvider.
  // Consequently, only explicitly logged events will be available in the bottom sheet, etc.
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
  const logEvent = (event: string, properties?: {[key: string]: any}) => {
    postHog?.capture(event, properties);
  };

  return {
    logEvent,
  };
};
