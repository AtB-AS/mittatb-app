import remoteConfig from '@react-native-firebase/remote-config';
import {ENABLE_TICKETING, PRIVACY_POLICY_URL, CUSTOMER_SERVICE_URL} from '@env';
import {
  MAPBOX_API_TOKEN,
  MAPBOX_NSR_SOURCE_LAYER_ID,
  MAPBOX_NSR_TILESET_ID,
  MAPBOX_USER_NAME,
} from '@env';

export type RemoteConfig = {
  /**
   * Some code readers are sensitive to padding around code.
   * Configurable parameter allows quick response to reading issues.
   */
  aztec_code_padding: number;
  /**
   * Some code readers are sensitive to code size.
   * Configurable parameter allows quick response to reading issues.
   */
  aztec_code_max_height: number;
  /**
   * Some code readers are sensitive to code size. Configurable parameter allows
   * quick response to reading issues. This field is used instead of
   * aztec_code_max_height when enable_new_token_barcode is true.
   */
  aztec_code_size_in_cm: number;
  customer_feedback_url: string;
  customer_service_url: string;
  default_map_filter: string;
  delay_share_travel_habits_screen_by_sessions_count: number;
  disable_email_field_in_profile_page: boolean;
  disable_travelcard: boolean;
  enable_activate_ticket_now: boolean;
  /**
   * Configuration whether the app should use auto sale or not when reserving
   * ticket. Auto sale means that there is no need for capturing the
   * transaction.
   */
  enable_auto_sale: boolean;
  enable_backend_sms_auth: boolean;
  enable_beacons: boolean;
  enable_bonus_program: boolean;
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
  enable_loading_error_screen: boolean;
  enable_loading_screen: boolean;
  enable_map_v2: boolean;
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
  enable_realtime_map: boolean;
  enable_refunds: boolean;
  enable_save_ticket_recipients: boolean;
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
  enable_vehicle_operator_logo: boolean;
  enable_vehicles_in_map: boolean;
  enable_vipps_login: boolean;
  enable_in_app_review: boolean;
  enable_in_app_review_for_announcements: boolean;
  enable_smart_park_and_ride: boolean;
  enable_harbor_distances_api: boolean;
  favourite_departures_poll_interval: number;
  feedback_questions: string;
  fetch_id_token_retry_count: number;
  flex_booking_number_of_days_available: number;
  flex_ticket_url: string;
  live_vehicle_stale_threshold: number;
  loading_screen_delay_ms: number;
  mapbox_api_token: string;
  mapbox_nsr_source_layer_id: string;
  mapbox_nsr_tileset_id: string;
  mapbox_user_name: string;
  minimum_app_version: string;
  must_upgrade_ticketing: boolean;
  new_favourites_info_url: string;
  privacy_policy_url: string;
  service_disruption_url: string;
  token_timeout_in_seconds: number;
  use_flexible_on_accessMode: boolean;
  use_flexible_on_directMode: boolean;
  use_flexible_on_egressMode: boolean;
  use_trygg_overgang_qr_code: boolean;
  vehicles_poll_interval: number;
};

export const defaultRemoteConfig: RemoteConfig = {
  aztec_code_max_height: 275,
  aztec_code_padding: 20,
  aztec_code_size_in_cm: 3.5,
  customer_feedback_url: '',
  customer_service_url: CUSTOMER_SERVICE_URL,
  default_map_filter: JSON.stringify({
    mobility: {
      CAR: {showAll: true},
      SCOOTER: {showAll: true},
      BICYCLE: {showAll: true},
    },
  }),
  delay_share_travel_habits_screen_by_sessions_count: 0,
  disable_email_field_in_profile_page: false,
  disable_travelcard: false,
  enable_activate_ticket_now: false,
  enable_auto_sale: false,
  enable_backend_sms_auth: true,
  enable_beacons: false,
  enable_bonus_program: false,
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
  enable_loading_error_screen: false,
  enable_loading_screen: true,
  enable_map_v2: true,
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
  enable_realtime_map: false,
  enable_refunds: true,
  enable_save_ticket_recipients: false,
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
  enable_vehicle_operator_logo: false,
  enable_vehicles_in_map: false,
  enable_vipps_login: false,
  enable_in_app_review: false,
  enable_in_app_review_for_announcements: false,
  enable_smart_park_and_ride: false,
  enable_harbor_distances_api: false,
  favourite_departures_poll_interval: 30000,
  feedback_questions: '',
  fetch_id_token_retry_count: 3,
  flex_booking_number_of_days_available: 7,
  flex_ticket_url: '',
  live_vehicle_stale_threshold: 15,
  loading_screen_delay_ms: 200,
  mapbox_api_token: MAPBOX_API_TOKEN,
  mapbox_nsr_source_layer_id: MAPBOX_NSR_SOURCE_LAYER_ID,
  mapbox_nsr_tileset_id: MAPBOX_NSR_TILESET_ID,
  mapbox_user_name: MAPBOX_USER_NAME,
  minimum_app_version: '',
  must_upgrade_ticketing: false,
  new_favourites_info_url: '',
  privacy_policy_url: PRIVACY_POLICY_URL,
  service_disruption_url: '',
  token_timeout_in_seconds: 10,
  use_flexible_on_accessMode: true,
  use_flexible_on_directMode: true,
  use_flexible_on_egressMode: true,
  use_trygg_overgang_qr_code: false,
  vehicles_poll_interval: 20000,
};

remoteConfig().setDefaults(defaultRemoteConfig);

export type RemoteConfigKeys = keyof RemoteConfig;

export function getConfig(): RemoteConfig {
  const values = remoteConfig().getAll();

  const aztec_code_max_height =
    values['aztec_code_max_height']?.asNumber() ??
    defaultRemoteConfig.aztec_code_max_height;
  const aztec_code_padding =
    values['aztec_code_padding']?.asNumber() ??
    defaultRemoteConfig.aztec_code_padding;
  const aztec_code_size_in_cm =
    values['aztec_code_size_in_cm']?.asNumber() ??
    defaultRemoteConfig.aztec_code_size_in_cm;
  const customer_feedback_url =
    values['customer_feedback_url']?.asString() ??
    defaultRemoteConfig.customer_feedback_url;
  const customer_service_url =
    values['customer_service_url']?.asString() ??
    defaultRemoteConfig.customer_service_url;
  const default_map_filter =
    values['default_map_filter']?.asString() ??
    defaultRemoteConfig.default_map_filter;
  const delay_share_travel_habits_screen_by_sessions_count =
    values['delay_share_travel_habits_screen_by_sessions_count']?.asNumber() ??
    defaultRemoteConfig.delay_share_travel_habits_screen_by_sessions_count;
  const disable_email_field_in_profile_page =
    values['disable_email_field_in_profile_page']?.asBoolean() ?? false;
  const disable_travelcard =
    values['disable_travelcard']?.asBoolean() ??
    defaultRemoteConfig.disable_travelcard;
  const enable_activate_ticket_now =
    values['enable_activate_ticket_now']?.asBoolean() ??
    defaultRemoteConfig.enable_activate_ticket_now;
  const enable_auto_sale =
    values['enable_auto_sale']?.asBoolean() ??
    defaultRemoteConfig.enable_auto_sale;
  const enable_backend_sms_auth =
    values['enable_backend_sms_auth']?.asBoolean() ??
    defaultRemoteConfig.enable_backend_sms_auth;
  const enable_beacons =
    values['enable_beacons']?.asBoolean() ?? defaultRemoteConfig.enable_beacons;
  const enable_bonus_program =
    values['enable_bonus_program']?.asBoolean() ??
    defaultRemoteConfig.enable_bonus_program;
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
  const enable_loading_error_screen =
    values['enable_loading_error_screen']?.asBoolean() ??
    defaultRemoteConfig.enable_loading_error_screen;
  const enable_loading_screen =
    values['enable_loading_screen']?.asBoolean() ??
    defaultRemoteConfig.enable_loading_screen;
  const enable_map_v2 =
    values['enable_map_v2']?.asBoolean() ?? defaultRemoteConfig.enable_map_v2;
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
  const enable_realtime_map =
    values['enable_realtime_map']?.asBoolean() ??
    defaultRemoteConfig.enable_realtime_map;
  const enable_refunds =
    values['enable_refunds']?.asBoolean() ?? defaultRemoteConfig.enable_refunds;
  const enable_save_ticket_recipients =
    values['enable_save_ticket_recipients']?.asBoolean() ??
    defaultRemoteConfig.enable_save_ticket_recipients;
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
  const enable_vehicle_operator_logo =
    values['enable_vehicle_operator_logo']?.asBoolean() ??
    defaultRemoteConfig.enable_vehicle_operator_logo;
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
  const favourite_departures_poll_interval =
    values['favourite_departures_poll_interval']?.asNumber() ??
    defaultRemoteConfig.favourite_departures_poll_interval;
  const feedback_questions =
    values['feedback_questions']?.asString() ??
    defaultRemoteConfig.feedback_questions;
  const fetch_id_token_retry_count =
    values['fetch_id_token_retry_count']?.asNumber() ??
    defaultRemoteConfig.fetch_id_token_retry_count;
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
  const must_upgrade_ticketing =
    values['must_upgrade_ticketing']?.asBoolean() ?? false;
  const new_favourites_info_url =
    values['new_favourites_info_url']?.asString() ??
    defaultRemoteConfig.new_favourites_info_url;
  const privacy_policy_url =
    values['privacy_policy_url']?.asString() ??
    defaultRemoteConfig.privacy_policy_url;
  const service_disruption_url =
    values['service_disruption_url']?.asString() ??
    defaultRemoteConfig.service_disruption_url;
  const token_timeout_in_seconds =
    values['token_timeout_in_seconds']?.asNumber() ??
    defaultRemoteConfig.token_timeout_in_seconds;
  const use_flexible_on_accessMode =
    values['use_flexible_on_accessMode']?.asBoolean() ??
    defaultRemoteConfig.use_flexible_on_accessMode;
  const use_flexible_on_directMode =
    values['use_flexible_on_directMode']?.asBoolean() ??
    defaultRemoteConfig.use_flexible_on_directMode;
  const use_flexible_on_egressMode =
    values['use_flexible_on_egressMode']?.asBoolean() ??
    defaultRemoteConfig.use_flexible_on_egressMode;
  const use_trygg_overgang_qr_code =
    values['use_trygg_overgang_qr_code']?.asBoolean() ??
    defaultRemoteConfig.use_trygg_overgang_qr_code;
  const vehicles_poll_interval =
    values['vehicles_poll_interval']?.asNumber() ??
    defaultRemoteConfig.vehicles_poll_interval;

  return {
    aztec_code_max_height,
    aztec_code_padding,
    aztec_code_size_in_cm,
    customer_feedback_url,
    customer_service_url,
    default_map_filter,
    delay_share_travel_habits_screen_by_sessions_count,
    disable_email_field_in_profile_page,
    disable_travelcard,
    enable_activate_ticket_now,
    enable_auto_sale,
    enable_backend_sms_auth,
    enable_beacons,
    enable_bonus_program,
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
    enable_loading_error_screen,
    enable_loading_screen,
    enable_map_v2,
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
    enable_realtime_map,
    enable_refunds,
    enable_save_ticket_recipients,
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
    enable_vehicle_operator_logo,
    enable_vehicles_in_map,
    enable_vipps_login,
    enable_in_app_review,
    enable_in_app_review_for_announcements,
    enable_smart_park_and_ride,
    enable_harbor_distances_api,
    favourite_departures_poll_interval,
    feedback_questions,
    fetch_id_token_retry_count,
    flex_booking_number_of_days_available,
    flex_ticket_url,
    live_vehicle_stale_threshold,
    loading_screen_delay_ms,
    mapbox_api_token,
    mapbox_nsr_source_layer_id,
    mapbox_nsr_tileset_id,
    mapbox_user_name,
    minimum_app_version,
    must_upgrade_ticketing,
    new_favourites_info_url,
    privacy_policy_url,
    service_disruption_url,
    token_timeout_in_seconds,
    use_flexible_on_accessMode,
    use_flexible_on_directMode,
    use_flexible_on_egressMode,
    use_trygg_overgang_qr_code,
    vehicles_poll_interval,
  };
}
