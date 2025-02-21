import React, {createContext, useContext, useEffect, useMemo} from 'react';
import {PostHog, PostHogProvider} from 'posthog-react-native';
import {POSTHOG_API_KEY, POSTHOG_HOST} from '@env';
import {AnalyticsEventContext} from './types';
import {useAuthContext} from '@atb/auth';
import Bugsnag from '@bugsnag/react-native';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const AnalyticsContext = createContext<PostHog | undefined>(undefined);

export const AnalyticsContextProvider: React.FC = ({children}) => {
  const {userId, authenticationType} = useAuthContext();
  const {isPosthogEnabled} = useFeatureTogglesContext();

  const client = useMemo(
    () =>
      isPosthogEnabled && POSTHOG_HOST && POSTHOG_API_KEY
        ? new PostHog(POSTHOG_API_KEY, {host: POSTHOG_HOST})
        : undefined,
    [isPosthogEnabled],
  );

  useEffect(() => {
    if (userId) {
      client?.identify(userId, {authenticationType});
    }
  }, [client, userId, authenticationType]);

  return (
    <AnalyticsContext.Provider value={client}>
      {client && (
        <PostHogProvider
          autocapture={{
            captureScreens: true,
            captureLifecycleEvents: true,
            captureTouches: false,
          }}
          client={client}
        >
          {children}
        </PostHogProvider>
      )}
      {!client && children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = () => {
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
