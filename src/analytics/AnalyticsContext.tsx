import React, {createContext, useEffect, useState} from 'react';
import PostHog, {PostHogProvider} from 'posthog-react-native';
import {initPostHog} from '@atb/analytics/postHog';

export const AnalyticsContext = createContext<PostHog | undefined>(undefined);

export const AnalyticsContextProvider: React.FC = ({children}) => {
  const [client, setClient] = useState<PostHog>();

  useEffect(() => {
    initPostHog().then(setClient);
  }, []);

  return (
    <AnalyticsContext.Provider value={client}>
      <PostHogProvider client={client}>{children}</PostHogProvider>
    </AnalyticsContext.Provider>
  );
};
