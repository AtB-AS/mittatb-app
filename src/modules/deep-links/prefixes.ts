import {APP_SCHEME, APP_LINK_HOST} from '@env';

export const APP_SCHEME_PREFIX = `${APP_SCHEME}://`;
export const APP_LINK_PREFIX = APP_LINK_HOST
  ? `https://${APP_LINK_HOST}`
  : undefined;
