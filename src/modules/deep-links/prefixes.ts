import {APP_SCHEME, APP_LINK_HOST, APP_SITE_HOST} from '@env';

export const APP_SCHEME_PREFIX = `${APP_SCHEME}://`;
export const APP_LINK_PREFIXES = [APP_LINK_HOST, APP_SITE_HOST]
  .filter((host): host is string => !!host)
  .map((host) => `https://${host}`);
