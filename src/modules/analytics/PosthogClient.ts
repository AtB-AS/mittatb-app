import {PostHog} from 'posthog-react-native';

let client: PostHog | undefined;

export const initPosthogClient = (
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

export const getPosthogClient = () => client;
