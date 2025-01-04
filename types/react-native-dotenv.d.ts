declare module '@env' {
  export const API_BASE_URL: string;
  export const WS_API_BASE_URL: string;
  export const APP_VERSION: string;
  export const IOS_BUNDLE_IDENTIFIER: string;
  export const PRIVACY_POLICY_URL: string;
  export const CUSTOMER_SERVICE_URL: string;
  export const MAPBOX_API_TOKEN: string;
  export const MAPBOX_STOP_PLACES_STYLE_URL: string;
  export const MAPBOX_USER_NAME: string;
  export const MAPBOX_NSR_TILESET_ID: string; // copy tileset id from data manager in mapbox studio
  export const MAPBOX_NSR_SOURCE_LAYER_ID: string; // the name given to the tileset in data manager in mapbox studio
  export const AUTHORITY: string;
  export const APP_ORG: import('./app-orgs').AppOrgs;
  export const APP_GROUP_NAME: string;
  export const APP_SCHEME: string;
  export const TARIFF_ZONE_AUTHORITY: import('./app-orgs').TariffZoneAuthorities;
  export const FOCUS_LATITUDE: string;
  export const FOCUS_LONGITUDE: string;
  export const IS_QA_ENV: string | undefined;
  export const SAFETY_NET_API_KEY: string;
  export const ENABLE_TICKETING: string | undefined;
  export const POSTHOG_API_KEY: string | undefined;
  export const POSTHOG_HOST: string | undefined;
  export const KETTLE_API_KEY: string | undefined;
}
