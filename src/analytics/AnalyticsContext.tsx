import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {PostHog, PostHogProvider} from 'posthog-react-native'
import {POSTHOG_API_KEY, POSTHOG_HOST} from '@env';
import {AnalyticsEventContext} from './types';
import {useAuthState} from '@atb/auth';
import Bugsnag from '@bugsnag/react-native';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {useIsPosthogEnabled} from '@atb/analytics/use-is-posthog-enabled';

export const AnalyticsContext = createContext<PostHog | undefined>(undefined);



export const AnalyticsContextProvider: React.FC = ({children}) => {
  const [client, setClient] = useState<PostHog>();
  const {userId, authenticationType} = useAuthState();
  const appStatus = useAppStateStatus();
  const [isPosthogEnabled] = useIsPosthogEnabled();

  const authTypeRef = useRef(authenticationType);
  useEffect(() => {
    authTypeRef.current = authenticationType;
  }, [authenticationType]);

  if (isPosthogEnabled && POSTHOG_HOST && POSTHOG_API_KEY && !client) {
    const postHog = new PostHog(POSTHOG_API_KEY, {
      host: POSTHOG_HOST
    })
    setClient(postHog);
  }

  useEffect(() => {
    
  }, [isPosthogEnabled, client]);

  useEffect(() => {
    if (userId && client) {
      client.identify(userId, {
        authenticationType: authTypeRef.current,
      });
      return () => {
        client?.reset();
      };
    }
  }, [userId, client]);

  useEffect(() => {
    client?.capture(`App status: ${appStatus}`);
  }, [appStatus, client]);

  return (
    <AnalyticsContext.Provider value={client}>
      <PostHogProvider autocapture={false} client={client}>
        {children}
      </PostHogProvider>
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const postHog = useContext(AnalyticsContext);
  return useMemo(
    () => ({
      logEvent: (
        context: AnalyticsEventContext,
        event: string,
        properties?: {[key: string]: any},
      ) => {
        if (!postHog) {
          Bugsnag.leaveBreadcrumb(
            `Event '${event}' could not be logged in PostHog. PostHog is undefined.`,
          );
          return;
        }
        postHog.capture(`${context}: ${event}`, properties);
      },
    }),
    [postHog],
  );
};
