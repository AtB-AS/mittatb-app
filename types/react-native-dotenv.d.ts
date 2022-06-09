declare module '@env' {
  export const API_BASE_URL: string;
  export const APP_VERSION: string;
  export const IOS_BUNDLE_IDENTIFIER: string;
  export const PRIVACY_POLICY_URL: string;
  export const MAPBOX_API_TOKEN: string;
  export const MAPBOX_STOP_PLACES_STYLE_URL: string;
  export const AUTHORITY: string;
  export const APP_ORG: import('./app-orgs').AppOrgs;
  export const TARIFF_ZONE: import('./app-orgs').TariffZones;
  export const FOCUS_LATITUDE: number;
  export const FOCUS_LONGITUDE: number;
  export const IS_QA_ENV: string | undefined;
  export const SAFETY_NET_API_KEY: string;
  export const ENABLE_TICKETING: string | undefined;
}
