import PostHog from 'posthog-react-native';
import {POSTHOG_API_KEY, POSTHOG_HOST} from '@env';

export const initPostHog = () =>
  POSTHOG_API_KEY
    ? PostHog.initAsync(POSTHOG_API_KEY, {
        host: POSTHOG_HOST,
      })
    : Promise.resolve(undefined);
