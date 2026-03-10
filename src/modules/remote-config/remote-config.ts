import remoteConfig from '@react-native-firebase/remote-config';
import {ENABLE_TICKETING, CUSTOMER_SERVICE_URL} from '@env';
import {
  MAPBOX_API_TOKEN,
  MAPBOX_NSR_SOURCE_LAYER_ID,
  MAPBOX_NSR_TILESET_ID,
  MAPBOX_USER_NAME,
} from '@env';

export type RemoteConfig = {
  customer_service_url: string;
  default_map_filter: string;
  disable_email_field_in_profile_page: boolean;
  disable_travelcard: boolean;
  enable_activate_ticket_now: boolean;
  enable_apple_pay: boolean;
  /**
   * Configuration whether the app should use auto sale or not when reserving
   * ticket. Auto sale means that there is no need for capturing the
   * transaction.
   */
  enable_auto_sale: boolean;
  enable_car_sharing_in_map: boolean;
  enable_city_bikes_in_map: boolean;
  enable_event_stream: boolean;
  enable_event_stream_fare_contracts: boolean;
  enable_experimental_features: boolean;
  enable_extended_onboarding: boolean;
  enable_flexible_transport: boolean;
  enable_from_travel_search_to_ticket_boat: boolean;
  enable_from_travel_search_to_ticket: boolean;
  enable_geofencing_zones: boolean;
  enable_geofencing_zones_as_tiles: boolean;
  enable_intercom: boolean;
  enable_loading_screen: boolean;
  enable_non_transit_trip_search: boolean;
  enable_nynorsk: boolean;
  enable_new_token_barcode: boolean;
  enable_new_token_barcode_base64: boolean;
  enable_on_behalf_of: boolean;
  enable_onboarding_login: boolean;
  enable_only_stop_places_checkbox: boolean;
  enable_parking_violations_reporting: boolean;
  enable_posthog: boolean;
  enable_push_notifications: boolean;
  enable_refunds: boolean;
  enable_server_time: boolean;
  enable_shmo_deep_integration: boolean;
  enable_show_valid_time_info: boolean;
  enable_ticket_information: boolean;
  enable_ticketing: boolean;
  enable_tips_and_information: boolean;
  enable_token_fallback_on_timeout: boolean;
  enable_token_fallback: boolean;
  enable_travel_aid_stop_button: boolean;
  enable_travel_aid: boolean;
  enable_vehicles_in_map: boolean;
  enable_vipps_login: boolean;
  enable_in_app_review: boolean;
  enable_in_app_review_for_announcements: boolean;
  enable_smart_park_and_ride: boolean;
  enable_harbor_distances_api: boolean;
  flex_booking_number_of_days_available: number;
  flex_ticket_url: string;
  live_vehicle_stale_threshold: number;
  loading_screen_delay_ms: number;
  mapbox_api_token: string;
  mapbox_nsr_source_layer_id: string;
  mapbox_nsr_tileset_id: string;
  mapbox_user_name: string;
  minimum_app_version: string;
  service_disruption_url: string;
  token_timeout_in_seconds: number;
  use_trygg_overgang_qr_code: boolean;
};

export const defaultRemoteConfig: RemoteConfig = {
  customer_service_url: CUSTOMER_SERVICE_URL,
  default_map_filter: JSON.stringify({
    mobility: {
      CAR: {showAll: true},
      SCOOTER: {showAll: true},
      BICYCLE: {showAll: true},
    },
  }),
  disable_email_field_in_profile_page: false,
  disable_travelcard: false,
  enable_activate_ticket_now: false,
  enable_apple_pay: false,
  enable_auto_sale: false,
  enable_car_sharing_in_map: false,
  enable_city_bikes_in_map: false,
  enable_extended_onboarding: false,
  enable_experimental_features: true,
  enable_flexible_transport: false,
  enable_from_travel_search_to_ticket_boat: false,
  enable_from_travel_search_to_ticket: false,
  enable_geofencing_zones: false,
  enable_geofencing_zones_as_tiles: false,
  enable_intercom: false,
  enable_loading_screen: true,
  enable_non_transit_trip_search: true,
  enable_new_token_barcode: false,
  enable_new_token_barcode_base64: false,
  enable_nynorsk: true,
  enable_on_behalf_of: false,
  enable_onboarding_login: true,
  enable_only_stop_places_checkbox: false,
  enable_parking_violations_reporting: false,
  enable_posthog: false,
  enable_push_notifications: false,
  enable_refunds: true,
  enable_server_time: true,
  enable_shmo_deep_integration: false,
  enable_show_valid_time_info: true,
  enable_ticket_information: false,
  enable_ticketing: !!JSON.parse(ENABLE_TICKETING || 'false'),
  enable_event_stream: false,
  enable_event_stream_fare_contracts: false,
  enable_tips_and_information: false,
  enable_token_fallback_on_timeout: true,
  enable_token_fallback: true,
  enable_travel_aid_stop_button: false,
  enable_travel_aid: false,
  enable_vehicles_in_map: false,
  enable_vipps_login: false,
  enable_in_app_review: false,
  enable_in_app_review_for_announcements: false,
  enable_smart_park_and_ride: false,
  enable_harbor_distances_api: false,
  flex_booking_number_of_days_available: 7,
  flex_ticket_url: '',
  live_vehicle_stale_threshold: 15,
  loading_screen_delay_ms: 200,
  mapbox_api_token: MAPBOX_API_TOKEN,
  mapbox_nsr_source_layer_id: MAPBOX_NSR_SOURCE_LAYER_ID,
  mapbox_nsr_tileset_id: MAPBOX_NSR_TILESET_ID,
  mapbox_user_name: MAPBOX_USER_NAME,
  minimum_app_version: '',
  service_disruption_url: '',
  token_timeout_in_seconds: 10,
  use_trygg_overgang_qr_code: false,
};

export type RemoteConfigKeys = keyof RemoteConfig;

export function getConfig(): RemoteConfig {
  const values = remoteConfig().getAll();

  const customer_service_url =
    values['customer_service_url']?.asString() ??
    defaultRemoteConfig.customer_service_url;
  const default_map_filter =
    values['default_map_filter']?.asString() ??
    defaultRemoteConfig.default_map_filter;
  const disable_email_field_in_profile_page =
    values['disable_email_field_in_profile_page']?.asBoolean() ?? false;
  const disable_travelcard =
    values['disable_travelcard']?.asBoolean() ??
    defaultRemoteConfig.disable_travelcard;
  const enable_activate_ticket_now =
    values['enable_activate_ticket_now']?.asBoolean() ??
    defaultRemoteConfig.enable_activate_ticket_now;
  const enable_apple_pay =
    values['enable_apple_pay']?.asBoolean() ??
    defaultRemoteConfig.enable_apple_pay;
  const enable_auto_sale =
    values['enable_auto_sale']?.asBoolean() ??
    defaultRemoteConfig.enable_auto_sale;
  const enable_car_sharing_in_map =
    values['enable_car_sharing_in_map']?.asBoolean() ??
    defaultRemoteConfig.enable_car_sharing_in_map;
  const enable_city_bikes_in_map =
    values['enable_city_bikes_in_map']?.asBoolean() ??
    defaultRemoteConfig.enable_city_bikes_in_map;
  const enable_event_stream =
    values['enable_event_stream']?.asBoolean() ??
    defaultRemoteConfig.enable_event_stream;
  const enable_event_stream_fare_contracts =
    values['enable_event_stream_fare_contracts']?.asBoolean() ??
    defaultRemoteConfig.enable_event_stream_fare_contracts;
  const enable_experimental_features =
    values['enable_experimental_features']?.asBoolean() ??
    defaultRemoteConfig.enable_experimental_features;
  const enable_extended_onboarding =
    values['enable_extended_onboarding']?.asBoolean() ??
    defaultRemoteConfig.enable_extended_onboarding;
  const enable_flexible_transport =
    values['enable_flexible_transport']?.asBoolean() ??
    defaultRemoteConfig.enable_flexible_transport;
  const enable_from_travel_search_to_ticket =
    values['enable_from_travel_search_to_ticket']?.asBoolean() ??
    defaultRemoteConfig.enable_from_travel_search_to_ticket;
  const enable_from_travel_search_to_ticket_boat =
    values['enable_from_travel_search_to_ticket_boat']?.asBoolean() ??
    defaultRemoteConfig.enable_from_travel_search_to_ticket_boat;
  const enable_geofencing_zones =
    values['enable_geofencing_zones']?.asBoolean() ??
    defaultRemoteConfig.enable_geofencing_zones;
  const enable_geofencing_zones_as_tiles =
    values['enable_geofencing_zones_as_tiles']?.asBoolean() ??
    defaultRemoteConfig.enable_geofencing_zones_as_tiles;
  const enable_intercom = values['enable_intercom']?.asBoolean() ?? false;
  const enable_loading_screen =
    values['enable_loading_screen']?.asBoolean() ??
    defaultRemoteConfig.enable_loading_screen;
  const enable_non_transit_trip_search =
    values['enable_non_transit_trip_search']?.asBoolean() ??
    defaultRemoteConfig.enable_non_transit_trip_search;
  const enable_new_token_barcode =
    values['enable_new_token_barcode']?.asBoolean() ??
    defaultRemoteConfig.enable_new_token_barcode;
  const enable_new_token_barcode_base64 =
    values['enable_new_token_barcode_base64']?.asBoolean() ??
    defaultRemoteConfig.enable_new_token_barcode_base64;
  const enable_nynorsk =
    values['enable_nynorsk']?.asBoolean() ?? defaultRemoteConfig.enable_nynorsk;
  const enable_on_behalf_of =
    values['enable_on_behalf_of']?.asBoolean() ??
    defaultRemoteConfig.enable_on_behalf_of;
  const enable_onboarding_login =
    values['enable_onboarding_login']?.asBoolean() ??
    defaultRemoteConfig.enable_onboarding_login;
  const enable_only_stop_places_checkbox =
    values['enable_only_stop_places_checkbox']?.asBoolean() ??
    defaultRemoteConfig.enable_only_stop_places_checkbox;
  const enable_parking_violations_reporting =
    values['enable_parking_violations_reporting']?.asBoolean() ??
    defaultRemoteConfig.enable_parking_violations_reporting;
  const enable_posthog =
    values['enable_posthog']?.asBoolean() ?? defaultRemoteConfig.enable_posthog;
  const enable_push_notifications =
    values['enable_push_notifications']?.asBoolean() ??
    defaultRemoteConfig.enable_push_notifications;
  const enable_refunds =
    values['enable_refunds']?.asBoolean() ?? defaultRemoteConfig.enable_refunds;
  const enable_server_time =
    values['enable_server_time']?.asBoolean() ??
    defaultRemoteConfig.enable_server_time;
  const enable_shmo_deep_integration =
    values['enable_shmo_deep_integration']?.asBoolean() ??
    defaultRemoteConfig.enable_shmo_deep_integration;
  const enable_show_valid_time_info =
    values['enable_show_valid_time_info']?.asBoolean() ??
    defaultRemoteConfig.enable_show_valid_time_info;
  const enable_ticket_information =
    values['enable_ticket_information']?.asBoolean() ??
    defaultRemoteConfig.enable_ticket_information;
  const enable_ticketing = values['enable_ticketing']?.asBoolean() ?? false;
  const enable_tips_and_information =
    values['enable_tips_and_information']?.asBoolean() ??
    defaultRemoteConfig.enable_tips_and_information;
  const enable_token_fallback =
    values['enable_token_fallback']?.asBoolean() ??
    defaultRemoteConfig.enable_token_fallback;
  const enable_token_fallback_on_timeout =
    values['enable_token_fallback_on_timeout']?.asBoolean() ??
    defaultRemoteConfig.enable_token_fallback_on_timeout;
  const enable_travel_aid =
    values['enable_travel_aid']?.asBoolean() ??
    defaultRemoteConfig.enable_travel_aid;
  const enable_travel_aid_stop_button =
    values['enable_travel_aid_stop_button']?.asBoolean() ??
    defaultRemoteConfig.enable_travel_aid_stop_button;
  const enable_vehicles_in_map =
    values['enable_vehicles_in_map']?.asBoolean() ??
    defaultRemoteConfig.enable_vehicles_in_map;
  const enable_vipps_login =
    values['enable_vipps_login']?.asBoolean() ??
    defaultRemoteConfig.enable_vipps_login;
  const enable_in_app_review =
    values['enable_in_app_review']?.asBoolean() ??
    defaultRemoteConfig.enable_in_app_review;
  const enable_in_app_review_for_announcements =
    values['enable_in_app_review_for_announcements']?.asBoolean() ??
    defaultRemoteConfig.enable_in_app_review_for_announcements;
  const enable_smart_park_and_ride =
    values['enable_smart_park_and_ride']?.asBoolean() ??
    defaultRemoteConfig.enable_smart_park_and_ride;
  const enable_harbor_distances_api =
    values['enable_harbor_distances_api']?.asBoolean() ??
    defaultRemoteConfig.enable_harbor_distances_api;
  const flex_booking_number_of_days_available =
    values['flex_booking_number_of_days_available']?.asNumber() ??
    defaultRemoteConfig.flex_booking_number_of_days_available;
  const flex_ticket_url =
    values['flex_ticket_url']?.asString() ??
    defaultRemoteConfig.flex_ticket_url;
  const live_vehicle_stale_threshold =
    values['live_vehicle_stale_threshold']?.asNumber() ??
    defaultRemoteConfig.live_vehicle_stale_threshold;
  const loading_screen_delay_ms =
    values['loading_screen_delay_ms']?.asNumber() ??
    defaultRemoteConfig.loading_screen_delay_ms;
  const mapbox_api_token =
    values['mapbox_api_token']?.asString() ??
    defaultRemoteConfig.mapbox_api_token;
  const mapbox_nsr_source_layer_id =
    values['mapbox_nsr_source_layer_id']?.asString() ??
    defaultRemoteConfig.mapbox_nsr_source_layer_id;
  const mapbox_nsr_tileset_id =
    values['mapbox_nsr_tileset_id']?.asString() ??
    defaultRemoteConfig.mapbox_nsr_tileset_id;
  const mapbox_user_name =
    values['mapbox_user_name']?.asString() ??
    defaultRemoteConfig.mapbox_user_name;
  const minimum_app_version =
    values['minimum_app_version']?.asString() ??
    defaultRemoteConfig.minimum_app_version;
  const service_disruption_url =
    values['service_disruption_url']?.asString() ??
    defaultRemoteConfig.service_disruption_url;
  const token_timeout_in_seconds =
    values['token_timeout_in_seconds']?.asNumber() ??
    defaultRemoteConfig.token_timeout_in_seconds;
  const use_trygg_overgang_qr_code =
    values['use_trygg_overgang_qr_code']?.asBoolean() ??
    defaultRemoteConfig.use_trygg_overgang_qr_code;

  return {
    customer_service_url,
    default_map_filter,
    disable_email_field_in_profile_page,
    disable_travelcard,
    enable_activate_ticket_now,
    enable_apple_pay,
    enable_auto_sale,
    enable_car_sharing_in_map,
    enable_city_bikes_in_map,
    enable_event_stream,
    enable_event_stream_fare_contracts,
    enable_extended_onboarding,
    enable_experimental_features,
    enable_flexible_transport,
    enable_from_travel_search_to_ticket_boat,
    enable_from_travel_search_to_ticket,
    enable_geofencing_zones,
    enable_geofencing_zones_as_tiles,
    enable_intercom,
    enable_loading_screen,
    enable_non_transit_trip_search,
    enable_new_token_barcode,
    enable_new_token_barcode_base64,
    enable_nynorsk,
    enable_on_behalf_of,
    enable_onboarding_login,
    enable_only_stop_places_checkbox,
    enable_parking_violations_reporting,
    enable_posthog,
    enable_push_notifications,
    enable_refunds,
    enable_server_time,
    enable_shmo_deep_integration,
    enable_show_valid_time_info,
    enable_ticket_information,
    enable_ticketing,
    enable_tips_and_information,
    enable_token_fallback_on_timeout,
    enable_token_fallback,
    enable_travel_aid_stop_button,
    enable_travel_aid,
    enable_vehicles_in_map,
    enable_vipps_login,
    enable_in_app_review,
    enable_in_app_review_for_announcements,
    enable_smart_park_and_ride,
    enable_harbor_distances_api,
    flex_booking_number_of_days_available,
    flex_ticket_url,
    live_vehicle_stale_threshold,
    loading_screen_delay_ms,
    mapbox_api_token,
    mapbox_nsr_source_layer_id,
    mapbox_nsr_tileset_id,
    mapbox_user_name,
    minimum_app_version,
    service_disruption_url,
    token_timeout_in_seconds,
    use_trygg_overgang_qr_code,
  };
}
