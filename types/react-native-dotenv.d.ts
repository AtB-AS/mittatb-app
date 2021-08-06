import {AppOrgs} from './app-orgs.d';
declare module '@env' {
  export const API_BASE_URL: string;
  export const APP_VERSION: string;
  export const IOS_BUNDLE_IDENTIFIER: string;
  export const PRIVACY_POLICY_URL: string;
  export const MAPBOX_API_TOKEN: string;
  export const MAPBOX_STOP_PLACES_STYLE_URL: string;
  export const AUTHORITY_ID: string;
  export const APP_ORG: AppOrgs;
}
