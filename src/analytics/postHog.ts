import PostHog from 'posthog-react-native';
import {POSTHOG_API_KEY} from '@env';

export const initPostHog = () =>
  POSTHOG_API_KEY
    ? PostHog.initAsync(POSTHOG_API_KEY, {
        host: 'https://eu.posthog.com',
      })
    : Promise.resolve(undefined);
