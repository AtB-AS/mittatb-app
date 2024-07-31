import remoteConfig from '@react-native-firebase/remote-config';
import {ENABLE_TICKETING, PRIVACY_POLICY_URL, CUSTOMER_SERVICE_URL} from '@env';

export type RemoteConfig = {
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
  enable_car_sharing_in_map: boolean;
  enable_city_bikes_in_map: boolean;
  enable_extended_onboarding: boolean;
  enable_flexible_transport: boolean;
  enable_from_travel_search_to_ticket: boolean;
  enable_geofencing_zones: boolean;
  enable_intercom: boolean;
  enable_loading_error_screen: boolean;
  enable_loading_screen: boolean;
  enable_non_transit_trip_search: boolean;
  enable_on_behalf_of: boolean;
  enable_parking_violations_reporting: boolean;
  enable_posthog: boolean;
  enable_push_notifications: boolean;
  enable_realtime_map: boolean;
  enable_server_time: boolean;
  enable_show_valid_time_info: boolean;
  enable_ticket_information: boolean;
  enable_ticketing: boolean;
  enable_ticketing_assistant: boolean;
  enable_tips_and_information: boolean;
  enable_token_fallback: boolean;
  enable_token_fallback_on_timeout: boolean;
  enable_vehicle_operator_logo: boolean;
  enable_vehicles_in_map: boolean;
  enable_vipps_login: boolean;
  enable_save_ticket_recipients: boolean;
  favourite_departures_poll_interval: number;
  feedback_questions: string;
  flex_booking_number_of_days_available: number;
  flex_ticket_url: string;
  live_vehicle_stale_threshold: number;
  minimum_app_version: string;
  must_upgrade_ticketing: boolean;
  new_favourites_info_url: string;
  privacy_policy_url: string;
  service_disruption_url: string;
  token_timeout_in_seconds: number;
  tripsSearch_max_number_of_chained_searches: number;
  tripsSearch_target_number_of_initial_hits: number;
  tripsSearch_target_number_of_page_hits: number;
  use_flexible_on_accessMode: boolean;
  use_flexible_on_directMode: boolean;
  use_flexible_on_egressMode: boolean;
  use_trygg_overgang_qr_code: boolean;
  vehicles_poll_interval: number;
};

export const defaultRemoteConfig: RemoteConfig = {
  customer_feedback_url: '',
  customer_service_url: CUSTOMER_SERVICE_URL,
  default_map_filter: JSON.stringify({
    vehicles: {
      showVehicles: false,
    },
  }),
  delay_share_travel_habits_screen_by_sessions_count: 0,
  disable_email_field_in_profile_page: false,
  disable_travelcard: false,
  enable_activate_ticket_now: false,
  enable_auto_sale: false,
  enable_backend_sms_auth: false,
  enable_beacons: false,
  enable_car_sharing_in_map: false,
  enable_city_bikes_in_map: false,
  enable_extended_onboarding: false,
  enable_flexible_transport: false,
  enable_from_travel_search_to_ticket: false,
  enable_geofencing_zones: false,
  enable_intercom: false,
  enable_loading_error_screen: false,
  enable_loading_screen: true,
  enable_non_transit_trip_search: true,
  enable_on_behalf_of: false,
  enable_parking_violations_reporting: false,
  enable_posthog: false,
  enable_push_notifications: false,
  enable_realtime_map: false,
  enable_server_time: true,
  enable_show_valid_time_info: true,
  enable_ticket_information: false,
  enable_ticketing: !!JSON.parse(ENABLE_TICKETING || 'false'),
  enable_ticketing_assistant: false,
  enable_tips_and_information: false,
  enable_token_fallback: true,
  enable_token_fallback_on_timeout: true,
  enable_vehicle_operator_logo: false,
  enable_vehicles_in_map: false,
  enable_vipps_login: false,
  enable_save_ticket_recipients: false,
  favourite_departures_poll_interval: 30000,
  feedback_questions: '',
  flex_booking_number_of_days_available: 7,
  flex_ticket_url: '',
  live_vehicle_stale_threshold: 15,
  minimum_app_version: '',
  must_upgrade_ticketing: false,
  new_favourites_info_url: '',
  privacy_policy_url: PRIVACY_POLICY_URL,
  service_disruption_url: '',
  token_timeout_in_seconds: 10,
  tripsSearch_max_number_of_chained_searches: 5,
  tripsSearch_target_number_of_initial_hits: 8,
  tripsSearch_target_number_of_page_hits: 8,
  use_flexible_on_accessMode: true,
  use_flexible_on_directMode: true,
  use_flexible_on_egressMode: true,
  use_trygg_overgang_qr_code: false,
  vehicles_poll_interval: 20000,
};

export type RemoteConfigKeys = keyof RemoteConfig;

export function getConfig(): RemoteConfig {
  const values = remoteConfig().getAll();

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
  const enable_car_sharing_in_map =
    values['enable_car_sharing_in_map']?.asBoolean() ??
    defaultRemoteConfig.enable_car_sharing_in_map;
  const enable_city_bikes_in_map =
    values['enable_city_bikes_in_map']?.asBoolean() ??
    defaultRemoteConfig.enable_city_bikes_in_map;
  const enable_extended_onboarding =
    values['enable_extended_onboarding']?.asBoolean() ??
    defaultRemoteConfig.enable_extended_onboarding;
  const enable_flexible_transport =
    values['enable_flexible_transport']?.asBoolean() ??
    defaultRemoteConfig.enable_flexible_transport;
  const enable_from_travel_search_to_ticket =
    values['enable_from_travel_search_to_ticket']?.asBoolean() ??
    defaultRemoteConfig.enable_from_travel_search_to_ticket;
  const enable_geofencing_zones =
    values['enable_geofencing_zones']?.asBoolean() ??
    defaultRemoteConfig.enable_geofencing_zones;
  const enable_intercom = values['enable_intercom']?.asBoolean() ?? false;
  const enable_loading_error_screen =
    values['enable_loading_error_screen']?.asBoolean() ??
    defaultRemoteConfig.enable_loading_error_screen;
  const enable_loading_screen =
    values['enable_loading_screen']?.asBoolean() ??
    defaultRemoteConfig.enable_loading_screen;
  const enable_non_transit_trip_search =
    values['enable_non_transit_trip_search']?.asBoolean() ??
    defaultRemoteConfig.enable_non_transit_trip_search;
  const enable_on_behalf_of =
    values['enable_on_behalf_of']?.asBoolean() ??
    defaultRemoteConfig.enable_on_behalf_of;
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
  const enable_server_time =
    values['enable_server_time']?.asBoolean() ??
    defaultRemoteConfig.enable_server_time;
  const enable_show_valid_time_info =
    values['enable_show_valid_time_info']?.asBoolean() ??
    defaultRemoteConfig.enable_show_valid_time_info;
  const enable_ticket_information =
    values['enable_ticket_information']?.asBoolean() ??
    defaultRemoteConfig.enable_ticket_information;
  const enable_ticketing = values['enable_ticketing']?.asBoolean() ?? false;
  const enable_ticketing_assistant =
    values['enable_ticketing_assistant']?.asBoolean() ??
    defaultRemoteConfig.enable_ticketing_assistant;
  const enable_tips_and_information =
    values['enable_tips_and_information']?.asBoolean() ??
    defaultRemoteConfig.enable_tips_and_information;
  const enable_token_fallback =
    values['enable_token_fallback']?.asBoolean() ??
    defaultRemoteConfig.enable_token_fallback;
  const enable_token_fallback_on_timeout =
    values['enable_token_fallback_on_timeout']?.asBoolean() ??
    defaultRemoteConfig.enable_token_fallback_on_timeout;
  const enable_vehicle_operator_logo =
    values['enable_vehicle_operator_logo']?.asBoolean() ??
    defaultRemoteConfig.enable_vehicle_operator_logo;
  const enable_vehicles_in_map =
    values['enable_vehicles_in_map']?.asBoolean() ??
    defaultRemoteConfig.enable_vehicles_in_map;
  const enable_vipps_login =
    values['enable_vipps_login']?.asBoolean() ??
    defaultRemoteConfig.enable_vipps_login;
  const enable_save_ticket_recipients =
    values['enable_save_ticket_recipients']?.asBoolean() ??
    defaultRemoteConfig.enable_save_ticket_recipients;
  const favourite_departures_poll_interval =
    values['favourite_departures_poll_interval']?.asNumber() ??
    defaultRemoteConfig.favourite_departures_poll_interval;
  const feedback_questions =
    values['feedback_questions']?.asString() ??
    defaultRemoteConfig.feedback_questions;
  const flex_booking_number_of_days_available =
    values['flex_booking_number_of_days_available']?.asNumber() ??
    defaultRemoteConfig.flex_booking_number_of_days_available;
  const flex_ticket_url =
    values['flex_ticket_url']?.asString() ??
    defaultRemoteConfig.flex_ticket_url;
  const live_vehicle_stale_threshold =
    values['live_vehicle_stale_threshold']?.asNumber() ??
    defaultRemoteConfig.live_vehicle_stale_threshold;
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
  const tripsSearch_max_number_of_chained_searches =
    values['tripsSearch_max_number_of_chained_searches']?.asNumber() ??
    defaultRemoteConfig.tripsSearch_max_number_of_chained_searches;
  const tripsSearch_target_number_of_initial_hits =
    values['tripsSearch_target_number_of_initial_hits']?.asNumber() ??
    defaultRemoteConfig.tripsSearch_target_number_of_initial_hits;
  const tripsSearch_target_number_of_page_hits =
    values['tripsSearch_target_number_of_page_hits']?.asNumber() ??
    defaultRemoteConfig.tripsSearch_target_number_of_page_hits;
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
    enable_car_sharing_in_map,
    enable_city_bikes_in_map,
    enable_extended_onboarding,
    enable_flexible_transport,
    enable_from_travel_search_to_ticket,
    enable_geofencing_zones,
    enable_intercom,
    enable_loading_error_screen,
    enable_loading_screen,
    enable_non_transit_trip_search,
    enable_on_behalf_of,
    enable_parking_violations_reporting,
    enable_posthog,
    enable_push_notifications,
    enable_realtime_map,
    enable_server_time,
    enable_show_valid_time_info,
    enable_ticket_information,
    enable_ticketing,
    enable_ticketing_assistant,
    enable_tips_and_information,
    enable_token_fallback,
    enable_token_fallback_on_timeout,
    enable_vehicle_operator_logo,
    enable_vehicles_in_map,
    enable_vipps_login,
    enable_save_ticket_recipients,
    favourite_departures_poll_interval,
    feedback_questions,
    flex_booking_number_of_days_available,
    flex_ticket_url,
    live_vehicle_stale_threshold,
    minimum_app_version,
    must_upgrade_ticketing,
    new_favourites_info_url,
    privacy_policy_url,
    service_disruption_url,
    token_timeout_in_seconds,
    tripsSearch_max_number_of_chained_searches,
    tripsSearch_target_number_of_initial_hits,
    tripsSearch_target_number_of_page_hits,
    use_flexible_on_accessMode,
    use_flexible_on_directMode,
    use_flexible_on_egressMode,
    use_trygg_overgang_qr_code,
    vehicles_poll_interval,
  };
}

// Pick keys of certain value type
type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;

export function getBooleanConfigValue(
  key: keyof SubType<RemoteConfig, boolean>,
) {
  return remoteConfig().getBoolean(key);
}

export function getStringConfigValue(key: keyof SubType<RemoteConfig, string>) {
  return remoteConfig().getString(key);
}

export function getNumberConfigValue(key: keyof SubType<RemoteConfig, number>) {
  return remoteConfig().getNumber(key);
}
