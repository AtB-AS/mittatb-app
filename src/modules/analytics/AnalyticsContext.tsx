import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  PostHog,
  type PostHogOptions,
  PostHogProvider,
} from 'posthog-react-native';
import {POSTHOG_API_KEY, POSTHOG_HOST} from '@env';
import {AnalyticsEventContext} from './types';
import {useAuthContext} from '@atb/modules/auth';
import Bugsnag from '@bugsnag/react-native';
import {useScreenshotAware} from 'react-native-screenshot-aware';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

let client: PostHog | undefined;

const initPosthogClient = (
  apiKey: string,
  host: string,
  isPosthogEnabled: boolean,
): PostHog | undefined => {
  if (!isPosthogEnabled || !apiKey || !host || client) return client;

  client = new PostHog(apiKey, {
    host,
  });

  return client;
};

export const getPosthogClientGlobal = () => client;

const OPTIONS: PostHogOptions = {
  captureAppLifecycleEvents: true,
};

export const AnalyticsContext = createContext<PostHog | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const AnalyticsContextProvider = ({children}: Props) => {
  const {userId, authenticationType} = useAuthContext();
  const {isPosthogEnabled} = useFeatureTogglesContext();

  const client = useMemo(
    () =>
      isPosthogEnabled && POSTHOG_HOST && POSTHOG_API_KEY
        ? initPosthogClient(POSTHOG_API_KEY, POSTHOG_HOST, isPosthogEnabled)
        : undefined,
    [isPosthogEnabled],
  );

  useEffect(() => {
    if (userId) {
      client?.identify(userId, {authenticationType});
    }
  }, [client, userId, authenticationType]);

  const handleScreenshot = useCallback(() => {
    if (!client) return;
    client.capture('ScreenshotTaken');
  }, [client]);

  useScreenshotAware(handleScreenshot);

  return (
    <AnalyticsContext.Provider value={client}>
      {client && (
        <PostHogProvider
          autocapture={false} // Screen events are handled differently for react-navigation v7 and higher
          client={client}
          options={OPTIONS}
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
